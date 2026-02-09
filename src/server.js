import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./managers/productManajer.js";
import apiRouter from "./routes/api/index.router.js";
import viewsRouter from "./routes/views/views.router.js";
import { __dirname } from "./utils.js";

const app = express();
const PORT = 8080;
app.use(express.json()); // solicitud en formato JSON (middleware)
app.use(express.urlencoded({ extended: true })); // extended: true = permite objetos y arrays anidados

// proccess.cwd = entrega el directorio actual de trabajo
app.use(express.static(__dirname + "/public")); // archivos estaticos en carpeta public (queda accesible directamente desde el navegador

// Handlebars - Configuración CORRECTA
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: `${process.cwd()}/src/views/layouts`, //  carpeta donde están los layouts (plantillas base)
  }),
);
app.set("views", __dirname + "/views"); // Define la carpeta donde Express buscará todas las vistas/plantillas. archivos .handlebars (vista1.handlebars, productos.handlebars, etc.)
app.set("view engine", "handlebars");
app.use("/api", apiRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriento en puerto ${PORT}`);
});



// CREACIÓN DEL WEBSOCKET, ENLAZADO A LA CARPETA PUBLIC/INDEX.JS

const socketServer = new Server(httpServer);
const productPath = path.resolve("src/data/products.json"); //  Dirección archivo de datos para agregar/eliminar productos
const productManager = new ProductManager(productPath);

// Evento "connection" Se dispara cada vez que un cliente abre la página y conecta con io()
socketServer.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Enviar productos actuales al conectarse, los lee directo de src/data/producst.json
  productManager
    .getProducts()
    .then((products) => {
      socket.emit("products", products);
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
    });


  //AGREGAR PRODUCTO
  socket.on("addProduct", async (productData) => {
    try {
      console.log("Agregando producto:", productData);

      const newProductData = {
        ...productData,
        status: true,
      };

      // addProduct retorna el producto ya con ID
      const created = await productManager.addProduct(newProductData);
      const products = await productManager.getProducts();

      socketServer.emit("products", products); // actualizar la lista con los productos agregados en tiempo real
      socket.emit("productAdded", { success: true, product: created });
      console.log("Producto agregado exitosamente");
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      socket.emit("productAdded", { success: false, error: error.message });
    }
  }); // FIN AGREGAR PRODUCTOS


  // ELIMINAR PRODUCTO
  socket.on("deleteProduct", async (id) => {
    try {
      console.log(" Eliminando producto:", id);
      await productManager.deleteProduct(id);
      const products = await productManager.getProducts();

 
      socketServer.emit("products", products); // nuevamente enviamos los productos en tiempo real actualizados una vez eliminado el producto desde el cliente
      socket.emit("productDeleted", { success: true });
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("productDeleted", {
        success: false,
        error: error.message,
      });
    }
  }); // fin eliminar producto

// actualizar el stock de los productos
  socket.on("updateStock", async ({ id, delta }) => {
    try {
      console.log("Actualizando stock:", { id, delta });

      const product = await productManager.getProductById(id);
      const newStock = Number(product.stock) + Number(delta); // calculamos stock

      if (Number.isNaN(newStock) || newStock < 0) {
        socket.emit("stockUpdated", {
          success: false,
          error: "Stock inválido (no puede ser negativo)",
        });
        return;
      }

      const updated = await productManager.updateProduct(id, {
        stock: newStock,
      });
      if (!updated) {
        socket.emit("stockUpdated", {
          success: false,
          error: "Producto no encontrado",
        });
        return;
      }
      const products = await productManager.getProducts();// leemos products.json para tener todos los stock actualizaodo
      socketServer.emit("products", products); // y enviamos productos actualizados
      socket.emit("stockUpdated", { success: true });
    } catch (error) {
      socket.emit("stockUpdated", { success: false, error: error.message });
    }
  }); // fin actualizar stock



  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
}); // fin socket
