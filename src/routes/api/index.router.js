/**
 * indice de rutas de  carts y products
 * 
 */


import { Router } from "express";
import productRouter from "./products.router.js";

const router = Router();

router.use('/products', productRouter);

export default router;