import { Router } from "express";
import path from "path";
import { ProductManager } from "../../managers/productManajer.js";

const router = Router();

const productPath = path.resolve("src/data/products.json");
const productManager = new ProductManager(productPath);

router.get("/home", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    // Importante: le pasas un objeto con variables a la vista
    return res.render("home", {
      title: "Home - Productos",
      products,
      hasProducts: products.length > 0,
    });
  } catch (error) {
    return res.status(500).send("Error cargando productos: " + error.message);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.render("realTimeProducts", { products });
  } catch (error) {
    return res.status(500).send("Error cargando productos: " + error.message);
  }
});

router.get("/vista", (req, res) => res.render("vista"));

export default router;
