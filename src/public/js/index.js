const socket = io();

// Elementos del DOM
const productForm = document.getElementById("productForm");
const productList = document.getElementById("products");
const emptyMessage = document.getElementById("emptyMessage");

//  RECIBIR-CARGAR LISTA DE PRODUCTOS DESDE SERVIDOR SRC/SERVER
socket.on("products", (products) => {
  const available = products.filter((p) => p.status === true); //Productos filtrados Solo status true
  renderProducts(available);
});

// AGREGAR PRODUCTO (FORM)
if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productData = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      code: document.getElementById("code").value.trim(),
      price: Number(document.getElementById("price").value),
      status: true,
      category: document.getElementById("category").value.trim(),
      stock: Number(document.getElementById("stock").value),
    };

    // Validación simple de relleno de formularios
    if (
      !productData.title ||
      !productData.category ||
      !productData.code ||
      !productData.description
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa: Nombre del producto, categoría, código y descripción",
      });

      return;
    }
    if (Number.isNaN(productData.price) || productData.price <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos inválidos",
        text: "El PRECIO debe ser numérico y mayor que cero.",
      });

      return;
    }
    if (Number.isNaN(productData.stock) || productData.stock < 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos inválidos",
        text: "El STOCK debe ser numérico y no menor que cero.",
      });

      return;
    }

    socket.emit("addProduct", productData);
    productForm.reset();
  });
} // fin agregar producto

// ELIMINAR PRODUCTO

window.deleteProduct = function (id) {
  Swal.fire({
    title: `¿Desea eliminar producto?`,
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#b91c1c",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("deleteProduct", id);
    }
  });
};

// AJUSTAR STOCK (sumar/restar)

window.updateStock = function (id, delta) {
  socket.emit("updateStock", { id, delta });
};

//  RENDERIZACIÓN DE PRODUCTOS EN STOCK, DESD EL ARRAY PRODUCTS => SOCKET.ON("PRODUCS", PRODUCTS =>{.....}) CONVERTIMOS EN HTML
function renderProducts(products) {
  if (!productList) return;

  if (!products || products.length === 0) {
    productList.innerHTML = "";
    if (emptyMessage) emptyMessage.style.display = "block";
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";

  productList.innerHTML = products
    .map(
      (p) => `
    <li data-id="${p.id}">
      <strong>${p.title}</strong>

      <div class="product-meta-row">
        <span class="product-meta price">$${p.price}</span>
        <span class="product-meta stock">Stock: ${p.stock}</span>
        <span class="product-meta">${p.category}</span>
      </div>

      <div class="product-info">
        <span class="product-meta">Código: ${p.code}</span>
        <span class="product-meta">ID: ${p.id}</span>
      </div>

      ${p.description ? `<div class="product-description">${p.description}</div>` : ""}

      <div class="product-actions">
        <button class="btn-delete" onclick="deleteProduct('${p.id}')">🗑️ Eliminar</button>
        <button class="btn-stock" onclick="updateStock('${p.id}', 1)">➕ Stock</button>
        <button class="btn-stock" onclick="updateStock('${p.id}', -1)">➖ Stock</button>
      </div>
    </li>
  `,
    )
    .join("");
}
