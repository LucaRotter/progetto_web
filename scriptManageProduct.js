const uploader = document.getElementById("imageUploader");
const carouselInner = document.getElementById("carouselInner");
const productList = document.getElementById("productList");
let Images = [];
let productCounter = 0;

uploader.addEventListener("change", function () {
  const newFiles = Array.from(this.files);
  const filesToAdd = newFiles.slice(0, 1);
  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      Images = [e.target.result]; 
      renderCarousel(false);
    };
    reader.readAsDataURL(file);
  });
  uploader.value = "";
});

function renderCarousel(isEditing = false) {
  carouselInner.innerHTML = "";
  if (Images.length === 0) return;
  const src = Images[0];
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
      Images = [];
      renderCarousel(true);
    });

    imgWrapper.appendChild(removeBtn);
  }

  item.appendChild(imgWrapper);
  carouselInner.appendChild(item);
}

function resetFormAndCarousel() {
  document.getElementById("productForm").reset();
  Images = [];
  renderCarousel(false);
  const form = document.getElementById("productForm");
  delete form.dataset.editingId;
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

  const name = document.getElementById("Name Product");
  const category = document.getElementById("Category");
  const price = document.getElementById("Price");
  const quantity = document.getElementById("Quantity");
  const description = document.getElementById("Description");
  const image = document.getElementById("imageUploader");
  const imageUrl = Images.length > 0 ? Images[0] : "";
 

  let valid = true;
  if (name.value.trim() === "") {
    name.classList.add("is-invalid");
    valid = false;
  } else {
    name.classList.remove("is-invalid");
  }
  if (!category.value) {
    category.classList.add("is-invalid");
    valid = false;
  } else {
    category.classList.remove("is-invalid");
  }
  const prezzoVal = parseFloat(price.value);
  if (isNaN(prezzoVal) || prezzoVal <= 0) {
    price.classList.add("is-invalid");
    valid = false;
  } else {
    price.classList.remove("is-invalid");
  }
  const quantitaVal = parseInt(quantity.value);
  if (isNaN(quantitaVal) || quantitaVal < 1) {
    quantity.classList.add("is-invalid");
    valid = false;
  } else {
    quantity.classList.remove("is-invalid");
  }
  if (Images.length === 0) {
    uploader.classList.add("is-invalid");
    valid = false;
  } else {
    uploader.classList.remove("is-invalid");
  }

  if (!description.value.trim()) {
  description.classList.add("is-invalid");
  formValido = false;
} else {
  description.classList.remove("is-invalid");
}


if (Images.length === 0) {
  uploader.classList.add("is-invalid");
  document.getElementById("uploadInfo").textContent = "You must upload 1 photo";
  valid = false;
} else {
  uploader.classList.remove("is-invalid");
  document.getElementById("uploadInfo").textContent = "";
}

console.log("Form valid:", category.value);

const token = sessionStorage.getItem("token");
console.log(token);

  if (!valid) return;

  fetch("http://localhost:8000/add-item",{
    method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`   
        },
        body: JSON.stringify({ name:name.value, category: category.value, description: description.value, price: price.value, quantity: quantity.value, image_url: imageUrl})
      })
      .then(response => response.json())
      .then(Data => {
            
    })
      .catch(error => {
        console.error('Error:', error);
        alert("Si è verificato un errore durante l'inserimento del prodotto");
    })

});

function addNewProduct() {
  productCounter++;

  const name = document.getElementById("Name Product").value;
  const category = document.getElementById("Category").value;
  const priceVal = parseFloat(document.getElementById("Price").value);
  const quantityVal = parseInt(document.getElementById("Quantity").value);

  const productCard = document.createElement("div");
  productCard.classList.add("card", "mb-4", "shadow");
  productCard.dataset.productId = productCounter;
  productCard.dataset.name = name;
  productCard.dataset.category = category;
  productCard.dataset.price = priceVal.toFixed(2);
  productCard.dataset.quantity = quantityVal;
  productCard.dataset.image = JSON.stringify(Images);

  let carouselId = `carouselCard${productCounter}`;

  const imgSrc = Images[0] || "";

  let imageCarouselHTML = `
    <div id="${carouselId}" style="width: 250px; height: 150px;">
      <img src="${imgSrc}" class="d-block w-100" style="height: 150px; object-fit: contain;">
    </div>
  `;

  prodottoCard.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center p-2">${imageCarouselHTML}</div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${nome}</h5>
          <p class="card-text mb-1">Categoria: <strong>${category}</strong></p>
          <p class="card-text mb-1">Prezzo: €${pricwVal.toFixed(2)}</p>
          <p class="card-text mb-0">Quantità: ${quantityVal}</p>
        </div>
      </div>
    </div>
  `;

  productList.appendChild(productCard);

  const emptyCartDiv = document.getElementById("emptyCart");
  if (emptyCartDiv) {
    emptyCartDiv.style.display = "none";
  }

  resetFormAndCarousel();

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalView"));
  if (modal) modal.hide();
}



function updateProduct(productId) {
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (!card) return;

  const name = document.getElementById("Name Product").value;
  const category = document.getElementById("Category").value;
  const priceVal = parseFloat(document.getElementById("Price").value);
  const quantityVal = parseInt(document.getElementById("Quantity").value);

  card.dataset.name = name;
  card.dataset.category = category;
  card.dataset.price = priceVal.toFixed(2);
  card.dataset.quantity = quantityVal;
  card.dataset.image = JSON.stringify(Images);

  let carouselId = `carouselCard${productId}`;

  const imgSrc = Images[0] || "";

  let imageCarouselHTML = `
    <div id="${carouselId}" style="width: 250px; height: 150px;">
      <img src="${imgSrc}" class="d-block w-100" style="height: 150px; object-fit: contain;">
    </div>
  `;

  card.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center p-2">${imageCarouselHTML}</div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${nome}</h5>
          <p class="card-text mb-1">Categoria: <strong>${category}</strong></p>
          <p class="card-text mb-1">Prezzo: €${priceVal.toFixed(2)}</p>
          <p class="card-text mb-0">Quantità: ${quantityVal}</p>
        </div>
      </div>
    </div>
  `;

  resetFormAndCarousel();

  delete document.getElementById("productForm").dataset.editingId;

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalView"));
  if (modal) modal.hide();
}

function openModalForEdit(productId) {
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (!card) return;

  document.getElementById("Name Product").value = card.dataset.name;
  document.getElementById("Category").value = card.dataset.category;
  document.getElementById("Price").value = card.dataset.price;
  document.getElementById("Quantity").value = card.dataset.quantity;

  Images = JSON.parse(card.dataset.image);
  renderCarousel(true);

  const form = document.getElementById("productForm");
  form.dataset.editingId = productId;

  const modal = new bootstrap.Modal(document.getElementById("modalView"));
  modal.show();
}
const modalElement = document.getElementById("modalView");
    

modalElement.addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("productForm");
  resetFormAndCarousel();      // resetta immagini e campi
  delete form.dataset.editingId;  // togli la modifica in corso
});

// --- Codice per popolare le categorie ---
const categories = [
  "libri",
  "elettronica",
  "abbigliamento",
  "casa",
  "giardino",
  "informatica",
  "sport",
  "bellezza",
  "cibo"
];

const selectElement = document.getElementById("Category");
categories.forEach(category => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  selectElement.appendChild(option);
});