import { Router } from 'express';
import { getAllProducts, getProductBySlug, getCategories } from '../controllers/productController.js';

const router = Router();

// list categories
router.get('/categories', getCategories);

// list products
router.get('/products', getAllProducts);

// get product
router.get('/products/:slug', getProductBySlug);

export default router;
