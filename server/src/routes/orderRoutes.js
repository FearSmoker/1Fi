import { Router } from 'express';
import { createOrder, getOrderByNumber, getAllOrders } from '../controllers/orderController.js';

const router = Router();

// POST /api/orders - Create a new order
router.post('/orders', createOrder);

// GET /api/orders - List all orders (optional ?email= filter)
router.get('/orders', getAllOrders);

// GET /api/orders/:orderNumber - Get order by order number
router.get('/orders/:orderNumber', getOrderByNumber);

export default router;
