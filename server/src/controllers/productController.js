import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get products
export async function getAllProducts(req, res, next) {
  try {
    const { category } = req.query;

    // filter by category if provided
    const where = category
      ? { category: { equals: category, mode: 'insensitive' } }
      : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          take: 1,
          select: {
            id: true,
            price: true,
            mrp: true,
            imageUrl: true,
            color: true,
            storage: true,
            emiPlans: {
              take: 1,
              orderBy: { tenure: 'asc' },
              select: { monthlyAmount: true, tenure: true },
            },
          },
        },
        _count: { select: { variants: true } },
      },
      orderBy: { id: 'asc' },
    });

    const result = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      variantCount: product._count.variants,
      defaultVariant: product.variants[0]
        ? {
            id: product.variants[0].id,
            price: product.variants[0].price,
            mrp: product.variants[0].mrp,
            imageUrl: product.variants[0].imageUrl,
            color: product.variants[0].color,
            storage: product.variants[0].storage,
            startingEMI: product.variants[0].emiPlans[0] || null,
          }
        : null,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// get single product
export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { id: 'asc' },
          include: {
            emiPlans: { orderBy: { tenure: 'asc' } },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: `No product found with slug: ${slug}`,
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

// get categories
export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { category: 'asc' },
    });

    const result = categories.map((c) => ({
      name: c.category,
      slug: c.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      productCount: c._count.id,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
}
