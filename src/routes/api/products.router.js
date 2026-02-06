/*
Enrutador de producst usando express.router() y verbos http get-post-put
*/

import { Router } from 'express';
import path from 'path';
import { ProductManager } from '../../managers/productManajer.js';

const router = Router();

// rutas almacenamiento de archivos EN CARPETA DATA, ARCHIVO json products.json
const productPath = path.resolve("src/data/products.json");
const productManager = new ProductManager(productPath);


// GET /api/products -> listar todos los productos existentes
router.get("/", async(req,res) =>{
try {
const products = await productManager.getProducts();   
return res.json({status:"success", payload:products});   
} catch (error) {
return res.status(500).json({status:"Error", error: error.message});    
}

});

// GET /api/products/:pid -> cada prodcto por id

router.get("/:id", async(req,res)=>{
try {
const pid = Number(req.params.id);
if(Number.isNaN(pid)){
    return res.status(400).json({status:"error",error:"El ID debe ser de tipo Numérico"});
}
const product = await productManager.getProductById(pid);
if(!product){
return res.status(404).json({status:"error", error: "Producto no encontrado"});
}
return res.json({status:"success", payload:product});

} catch (error) {
return res.status(500).json({ status: "error", error: error.message });

}

});

// POST /api/products -> creamos producto

/**
 * Usamos middleware multer para subir imagen al servidor upload.single('image')
 * 
 *  IMPORTANTE:
 * El nombre 'image' DEBE coincidir exactamente con el
 * key del archivo enviado en Postman o frontend.
 * 
 * 
 */

/*

router.post("/", upload.single('image'),async (req,res)=>{
try {
const newProduct = await productManager.addProduct({
  
  ...req.body,
  image: req.file.path
});
res.status(201).json({status:"success",payload:newProduct});  
    
} catch (error) {
return res.status(400).json({ status: "error", error: error.message });
}

});


*/

// POST /api/products -> creamos producto (SIN MULTER, SOLO JSON)
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct({
      ...req.body,
      // opcional: asegura que thumbnails sea array
      thumbnails: Array.isArray(req.body.thumbnails)
        ? req.body.thumbnails
        : (req.body.thumbnails ? [req.body.thumbnails] : []),
    });

    return res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});



// PUT /api/products/:pid -> actualizamos los campos enviados (sin tocar id)
router.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    if (Number.isNaN(pid)) {
      return res.status(400).json({ status: "error", error: "pid debe ser numérico" });
    }

    const updated = await productManager.updateProduct(pid, req.body);
    if (!updated) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    return res.json({ status: "success", payload: updated });
  } catch (error) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// DELETE /api/products/:pid -> eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    if (Number.isNaN(pid)) {
      return res.status(400).json({ status: "error", error: "pid debe ser numérico" });
    }

    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    return res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }


});

export default router;