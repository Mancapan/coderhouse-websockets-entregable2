import fs from "fs/promises";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async writeFile_(data) {

    try{
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }catch(error){
      throw new Error("Error al escribir archivo", error.message);
    }
  }

  async readFile_() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      if (error.code === "ENOENT") {
        // Archivo no existe: devolvemos arreglo vacío
        return [];
      }
      // Cualquier otro error: lo propagamos
      throw error;
    }
  }

  generarId(products) {
    const maxId = products.reduce((max, prod) => (prod.id > max ? prod.id : max), 0);
    return maxId + 1;
  }

  async getProducts() {
    return await this.readFile_();
  }

  async getProductById(id) {
    const products = await this.readFile_();
    const productId = Number(id);

    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Producto NO encontrado");
    }
    return product;
  }

  async addProduct(productData) {
    const products = await this.readFile_();

    const newCode = String(productData.code);
    const codigoRepetido = products.some((p) => p.code === newCode);

    if (codigoRepetido) {
      throw new Error(`Ya existe un producto con code: ${newCode}`);
    }

    const nuevoProducto = {
      id: this.generarId(products),
      title: String(productData.title),
      description: String(productData.description),
      code: newCode,
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: String(productData.category),
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(nuevoProducto);
    await this.writeFile_(products);

    return nuevoProducto;
  }

  async updateProduct(id, updateData) {
    const products = await this.readFile_();
    const productId = Number(id);

    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    // no permitir actualizar id
    const { id: ignoredId, ...safeUpdate } = updateData;

    if (safeUpdate.code !== undefined) {
      const newCode = String(safeUpdate.code);
      const duplicate = products.some((p) => p.code === newCode && p.id !== productId);

      if (duplicate) throw new Error(`Ya existe otro producto con code: ${newCode}`);
      safeUpdate.code = newCode;
    }

    products[index] = { ...products[index], ...safeUpdate };

    await this.writeFile_(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.readFile_();
    const productId = Number(id);

    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error("El producto no existe");
    }

    const [deletedProduct] = products.splice(index, 1);
    await this.writeFile_(products);

    return deletedProduct;
  }


  
} // finc clase product manager