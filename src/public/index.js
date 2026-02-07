// public/js/index.js
// Cliente Socket.IO (navegador)
const socket = io();

// Elementos del DOM
const productForm = document.getElementById("productForm");
const productList = document.getElementById("products");
const emptyMessage = document.getElementById("emptyMessage");

// ===========================
// ✅ RECIBIR LISTA DE PRODUCTOS
// ===========================
socket.on("products", (products) => {
  // Solo status true
  const available = products.filter(p => p.status === true);
  renderProducts(available);
});

// ===========================
// ✅ MENSAJES SIMPLES
// ===========================
socket.on("productAdded", (res) => {
  if (!res.success) alert("Error al agregar: " + res.error);
});

socket.on("productDeleted", (res) => {
  if (!res.success) alert("Error al eliminar: " + res.error);
});

socket.on("productDisabled", (res) => {
  if (!res.success) alert("Error al desactivar: " + res.error);
});

socket.on("stockUpdated", (res) => {
  if (!res.success) alert("Error al actualizar stock: " + res.error);
});

// ===========================
// ✅ AGREGAR PRODUCTO (FORM)
// ===========================
if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productData = {
      title: document.getElementById("title").value.trim(),
      price: Number(document.getElementById("price").value),
      stock: Number(document.getElementById("stock").value),
      category: document.getElementById("category").value.trim(),
      code: document.getElementById("code").value.trim(),
      description: document.getElementById("description").value.trim(),
      status: true
    };

    // Validación simple
    if (!productData.title || !productData.category || !productData.code) {
      alert("Completa: title, category y code");
      return;
    }
    if (Number.isNaN(productData.price) || productData.price <= 0) {
      alert("Precio inválido");
      return;
    }
    if (Number.isNaN(productData.stock) || productData.stock < 0) {
      alert("Stock inválido");
      return;
    }

    socket.emit("addProduct", productData);
    productForm.reset();
  });
}

// ===========================
// ✅ ELIMINAR PRODUCTO
// ===========================
window.deleteProduct = function(id) {
  if (confirm("¿Eliminar producto ID " + id + "?")) {
    socket.emit("deleteProduct", id);
  }
};

// ===========================
// ✅ DESACTIVAR PRODUCTO (status=false) (opcional pero recomendado)
// ===========================
window.disableProduct = function(id) {
  if (confirm("¿Marcar como NO disponible el producto ID " + id + "?")) {
    socket.emit("disableProduct", id);
  }
};

// ===========================
// ✅ AJUSTAR STOCK (sumar/restar)
// ===========================
window.updateStock = function(id, delta) {
  socket.emit("updateStock", { id, delta });
};

// ===========================
// ✅ RENDER (simple)
// ===========================
function renderProducts(products) {
  if (!productList) return;

  if (!products || products.length === 0) {
    productList.innerHTML = "";
    if (emptyMessage) emptyMessage.style.display = "block";
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";

  productList.innerHTML = products.map(p => `
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
        <button class="btn-disable" onclick="disableProduct('${p.id}')">🚫 Desactivar</button>
        <button class="btn-stock" onclick="updateStock('${p.id}', 1)">➕ Stock</button>
        <button class="btn-stock" onclick="updateStock('${p.id}', -1)">➖ Stock</button>
      </div>
    </li>
  `).join("");
}
