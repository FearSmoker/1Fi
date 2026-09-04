import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// create order
export async function createOrder(req, res, next) {
  try {
    let { variantId, emiPlanId, customerName, customerEmail, customerPhone, shippingAddress } = req.body;

    customerName = customerName?.trim();
    customerEmail = customerEmail?.trim().toLowerCase();
    customerPhone = customerPhone?.trim();
    shippingAddress = shippingAddress?.trim();

    // check required fields
    if (!variantId || !emiPlanId || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['variantId', 'emiPlanId', 'customerName', 'customerEmail', 'customerPhone', 'shippingAddress'],
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // get variant details
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    // get emi plan
    const emiPlan = await prisma.eMIPlan.findUnique({
      where: { id: emiPlanId },
    });

    if (!emiPlan || emiPlan.variantId !== variantId) {
      return res.status(404).json({ error: 'EMI plan not found or does not match variant' });
    }

    // make an order number
    const orderNumber = `1FI-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // save order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        productName: `${variant.product.brand} ${variant.product.name}`,
        productBrand: variant.product.brand,
        variantColor: variant.color,
        variantStorage: variant.storage,
        variantImageUrl: variant.imageUrl,
        productPrice: variant.price,
        productMrp: variant.mrp,
        emiTenure: emiPlan.tenure,
        emiMonthlyAmount: emiPlan.monthlyAmount,
        emiInterestRate: emiPlan.interestRate,
        emiTotalAmount: emiPlan.totalAmount,
        emiCashback: emiPlan.cashback,
        emiIsNoCost: emiPlan.isNoCost,
        status: 'confirmed',
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

// get order by number
export async function getOrderByNumber(req, res, next) {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// get all orders
export async function getAllOrders(req, res, next) {
  try {
    const { email } = req.query;

    const where = email ? { customerEmail: email } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}
