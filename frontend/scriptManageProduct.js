const uploader = document.getElementById("imageUploader");
const carouselInner = document.getElementById("carouselInner");
const productList = document.getElementById("productList");
let allImages = [];
let productCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  fetch("http://localhost:8000/user-items/", {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
  })
    .then(response => response.json())
    .then(Data => {
      Data.items.forEach(element => {
        renderProductCard({
          item_id: element.item_id,
          name: element.name,
          category: element.category,
          price: element.price,
          quantity: element.quantity,
          image_url: element.image_url,
          description: element.description
        });
      });
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
});

uploader.addEventListener("change", function () {
  const newFiles = Array.from(this.files);
  if (newFiles.length > 1) {
    alert("Puoi caricare solo 1 immagine.");
  }
  const filesToAdd = newFiles.slice(0, 1);
  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      allImages = [e.target.result];
      renderCarousel(false);
    };
    reader.readAsDataURL(file);
  });
  uploader.value = "";
});

function renderCarousel(isEditing = false) {
  carouselInner.innerHTML = "";
  if (allImages.length === 0) return;
  const src = allImages[0];
  const item = document.createElement("div");
  item.className = "carousel-item active";

  const imgWrapper = document.createElement("div");
  imgWrapper.style.position = "relative";

  const img = document.createElement("img");
  img.src = src;
  img.className = "d-block w-100";
  img.style.maxHeight = "300px";
  img.style.objectFit = "contain";
  imgWrapper.appendChild(img);

  if (isEditing) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "5px";
    removeBtn.style.right = "10px";
    removeBtn.style.background = "rgba(255,255,255,0.7)";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "24px";
    removeBtn.style.height = "24px";
    removeBtn.style.fontSize = "18px";
    removeBtn.style.cursor = "pointer";
    removeBtn.title = "Rimuovi immagine";

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      allImages = [];
      renderCarousel(true);
    });

    imgWrapper.appendChild(removeBtn);
  }

  item.appendChild(imgWrapper);
  carouselInner.appendChild(item);
}

function resetFormAndCarousel() {
  document.getElementById("productForm").reset();
  allImages = [];
  document.getElementById("titleModal").textContent = "new Product";
  document.getElementById("ModalButton").textContent = "Add Product";
  renderCarousel(false);
  delete document.getElementById("productForm").dataset.editingId;
}

function openModalForNewProduct() {
  resetFormAndCarousel();
  const modal = new bootstrap.Modal(document.getElementById("modalView"));
  modal.show();
}

productList.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;
  const productId = card.dataset.productId;
  if (productId) {
    openModalForEdit(productId);
  }
});

document.getElementById("productForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("Name Product");
  const categoria = document.getElementById("Category");
  const prezzo = document.getElementById("Price");
  const quantita = document.getElementById("Quantity");

  let valid = true;
  if (nome.value.trim() === "") {
    nome.classList.add("is-invalid");
    valid = false;
  } else {
    nome.classList.remove("is-invalid");
  }
  if (!categoria.value) {
    categoria.classList.add("is-invalid");
    valid = false;
  } else {
    categoria.classList.remove("is-invalid");
  }
  const prezzoVal = parseFloat(prezzo.value);
  if (isNaN(prezzoVal) || prezzoVal <= 0) {
    prezzo.classList.add("is-invalid");
    valid = false;
  } else {
    prezzo.classList.remove("is-invalid");
  }
  const quantitaVal = parseInt(quantita.value);
  if (isNaN(quantitaVal) || quantitaVal < 1) {
    quantita.classList.add("is-invalid");
    valid = false;
  } else {
    quantita.classList.remove("is-invalid");
  }
  if (allImages.length === 0) {
    uploader.classList.add("is-invalid");
    valid = false;
  } else {
    uploader.classList.remove("is-invalid");
  }

  if (!valid) return;

  const form = this;
  const editingId = form.dataset.editingId;

  if (editingId) {
    updateProduct(editingId);
  } else {
    addNewProduct();
  }
});

function addNewProduct() {
  const token = localStorage.getItem("token");
  const nome = document.getElementById("Name Product").value;
  const categoria = document.getElementById("Category").value;
  const prezzoVal = parseFloat(document.getElementById("Price").value);
  const quantitaVal = parseInt(document.getElementById("Quantity").value);
  const description = document.getElementById("Description").value;
  const immagine = allImages[0];

  fetch("http://localhost:8000/add-item", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: nome,
      category: categoria,
      description: description,
      price: prezzoVal,
      quantity: quantitaVal,
      image_url: immagine
    })
  })
    .then(response => response.json())
    .then(Data => {
      renderProductCard({
        item_id: Data.item_id || `local-${productCounter++}`,
        name: nome,
        category: categoria,
        price: prezzoVal,
        quantity: quantitaVal,
        image_url: immagine,
        description: description
      });
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });

  resetFormAndCarousel();
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalView"));
  if (modal) modal.hide();
}

async function updateProduct(productId) {
  const token = localStorage.getItem("token");
  const nome = document.getElementById("Name Product").value;
  const categoria = document.getElementById("Category").value;
  const prezzoVal = parseFloat(document.getElementById("Price").value);
  const quantitaVal = parseInt(document.getElementById("Quantity").value);
  const description = document.getElementById("Description").value;
  const immagine = allImages[0];

  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`
  };

  try {
    fetch(`http://localhost:8000/update-name/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name: nome })
    });

    fetch(`http://localhost:8000/update-category/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ category: categoria })
    });

    fetch(`http://localhost:8000/update-price/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ price: prezzoVal })
    });

    fetch(`http://localhost:8000/update-quantity/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ quantity: quantitaVal })
    });

    fetch(`http://localhost:8000/update-description/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description })
    });



    // Aggiornamento DOM come prima
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    card.dataset.nome = nome;
    card.dataset.categoria = categoria;
    card.dataset.prezzo = prezzoVal.toFixed(2);
    card.dataset.quantita = quantitaVal;
    card.dataset.immagini = JSON.stringify([immagine]);
    card.dataset.description = description;

    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4 d-flex align-items-center p-2">
          <img src="${immagine}" class="d-block w-100" style="height: 150px; object-fit: contain;">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${nome}</h5>
            <p class="card-text mb-1">Categoria: <strong>${categoria}</strong></p>
            <p class="card-text mb-1">Prezzo: €${prezzoVal.toFixed(2)}</p>
            <p class="card-text mb-0">Quantità: ${quantitaVal}</p>
            <p class="card-text mb-0 d-none">descrizione:<em>${description}</em></p>
          </div>
        </div>
      </div>
    `;

    resetFormAndCarousel();
    delete document.getElementById("productForm").dataset.editingId;

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalView"));
    if (modal) modal.hide();

  } catch (error) {
    console.error("Errore nell'aggiornamento del prodotto:", error);
  }
}

function openModalForEdit(productId) {
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (!card) return;

  document.getElementById("Name Product").value = card.dataset.nome;
  document.getElementById("Category").value = card.dataset.categoria;
  document.getElementById("Price").value = card.dataset.prezzo;
  document.getElementById("Quantity").value = card.dataset.quantita;
  document.getElementById("Description").value = card.dataset.description;

  allImages = JSON.parse(card.dataset.immagini);
  renderCarousel(true);

  document.getElementById("titleModal").textContent = "update Product";
  document.getElementById("ModalButton").textContent = "update";
  const form = document.getElementById("productForm");
  form.dataset.editingId = productId;

  const modal = new bootstrap.Modal(document.getElementById("modalView"));
  modal.show();
}

const modalElement = document.getElementById("modalView");
modalElement.addEventListener("hidden.bs.modal", () => {
  resetFormAndCarousel();
  delete document.getElementById("productForm").dataset.editingId;
});

const categories = [
  "books",
  "electronics",
  "clothing",
  "home",
  "garden",
  "tech",
  "sports",
  "beauty",
  "food"
];
const selectElement = document.getElementById("Category");
categories.forEach(category => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  selectElement.appendChild(option);
});

function renderProductCard(productData) {
  const container = document.createElement("div");
  container.classList.add("col");
  const prodottoCard = document.createElement("div");
  prodottoCard.classList.add("card", "mb-4", "shadow");
  prodottoCard.dataset.productId = productData.item_id || `local-${productCounter++}`;
  prodottoCard.dataset.nome = productData.name;
  prodottoCard.dataset.categoria = productData.category;
  prodottoCard.dataset.prezzo = productData.price;
  prodottoCard.dataset.quantita = productData.quantity;
  prodottoCard.dataset.immagini = JSON.stringify([productData.image_url]);
  prodottoCard.dataset.description = productData.description;

  const imgSrc = productData.image_url || "";

  prodottoCard.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center p-2">
        <img src="${imgSrc}" class="d-block w-100" style="height: 150px; object-fit: contain;">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${productData.name}</h5>
          <p class="card-text mb-1">Categoria: <strong>${productData.category}</strong></p>
          <p class="card-text mb-1">Prezzo: €${parseFloat(productData.price).toFixed(2)}</p>
          <p class="card-text mb-0">Quantità: ${productData.quantity}</p>
          <p class="card-text mb-0 d-none">descrizione:<em>${productData.description}</em></p>
        </div>
      </div>
    </div>
  `;

  container.appendChild(prodottoCard);
  productList.appendChild(container);
}