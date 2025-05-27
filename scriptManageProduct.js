const uploader = document.getElementById("imageUploader");
const carouselInner = document.getElementById("carouselInner");
const productList = document.getElementById("productList");
let allImages = [];
let productCounter = 0;

uploader.addEventListener("change", function () {
  const newFiles = Array.from(this.files);
  if (newFiles.length > 1) {
    alert("Puoi caricare solo 1 immagine.");
  }
  const filesToAdd = newFiles.slice(0, 1);
  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      allImages = [e.target.result]; // solo 1 immagine
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
  renderCarousel(false);
  const form = document.getElementById("productForm");
  delete form.dataset.editingId;
}

// Nuova funzione per aprire modal per nuovo prodotto
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
  const descrizione = document.getElementById("Description");
  const immagini = document.getElementById("imageUploader");
  // Restituisci l'URL dell'immagine caricata (base64)

  const imageUrl = allImages.length > 0 ? allImages[0] : "";
 

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

  if (!descrizione.value.trim()) {
  descrizione.classList.add("is-invalid");
  formValido = false;
} else {
  descrizione.classList.remove("is-invalid");
}

// Immagini
if (immagini.files.length === 0 || immagini.files.length > 5) {
  immagini.classList.add("is-invalid");
  document.getElementById("uploadInfo").textContent = "Upload between 1 and 5 images";
  formValido = false;
} else {
  immagini.classList.remove("is-invalid");
  document.getElementById("uploadInfo").textContent = "You can upload max 5 photos";
}
console.log("Form valid:", categoria.value);

const token = sessionStorage.getItem("token");
console.log(token);

  if (!valid) return;

  fetch("http://localhost:8000/add-item",{
    method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`   
        },
        body: JSON.stringify({ name: nome.value, category: categoria.value, description: descrizione.value, price: prezzo.value, quantity: quantita.value, image_url: imageUrl})
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

  const nome = document.getElementById("Name Product").value;
  const categoria = document.getElementById("Category").value;
  const prezzoVal = parseFloat(document.getElementById("Price").value);
  const quantitaVal = parseInt(document.getElementById("Quantity").value);

  const prodottoCard = document.createElement("div");
  prodottoCard.classList.add("card", "mb-4", "shadow");
  prodottoCard.dataset.productId = productCounter;
  prodottoCard.dataset.nome = nome;
  prodottoCard.dataset.categoria = categoria;
  prodottoCard.dataset.prezzo = prezzoVal.toFixed(2);
  prodottoCard.dataset.quantita = quantitaVal;
  prodottoCard.dataset.immagini = JSON.stringify(allImages);

  let carouselId = `carouselCard${productCounter}`;

  const imgSrc = allImages[0] || "";

  let immaginiCarouselHTML = `
    <div id="${carouselId}" style="width: 250px; height: 150px;">
      <img src="${imgSrc}" class="d-block w-100" style="height: 150px; object-fit: contain;">
    </div>
  `;

  prodottoCard.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center p-2">${immaginiCarouselHTML}</div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${nome}</h5>
          <p class="card-text mb-1">Categoria: <strong>${categoria}</strong></p>
          <p class="card-text mb-1">Prezzo: €${prezzoVal.toFixed(2)}</p>
          <p class="card-text mb-0">Quantità: ${quantitaVal}</p>
        </div>
      </div>
    </div>
  `;

  productList.appendChild(prodottoCard);

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

  const nome = document.getElementById("Name Product").value;
  const categoria = document.getElementById("Category").value;
  const prezzoVal = parseFloat(document.getElementById("Price").value);
  const quantitaVal = parseInt(document.getElementById("Quantity").value);

  card.dataset.nome = nome;
  card.dataset.categoria = categoria;
  card.dataset.prezzo = prezzoVal.toFixed(2);
  card.dataset.quantita = quantitaVal;
  card.dataset.immagini = JSON.stringify(allImages);

  let carouselId = `carouselCard${productId}`;

  const imgSrc = allImages[0] || "";

  let immaginiCarouselHTML = `
    <div id="${carouselId}" style="width: 250px; height: 150px;">
      <img src="${imgSrc}" class="d-block w-100" style="height: 150px; object-fit: contain;">
    </div>
  `;

  card.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center p-2">${immaginiCarouselHTML}</div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${nome}</h5>
          <p class="card-text mb-1">Categoria: <strong>${categoria}</strong></p>
          <p class="card-text mb-1">Prezzo: €${prezzoVal.toFixed(2)}</p>
          <p class="card-text mb-0">Quantità: ${quantitaVal}</p>
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

  document.getElementById("Name Product").value = card.dataset.nome;
  document.getElementById("Category").value = card.dataset.categoria;
  document.getElementById("Price").value = card.dataset.prezzo;
  document.getElementById("Quantity").value = card.dataset.quantita;

  allImages = JSON.parse(card.dataset.immagini);
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