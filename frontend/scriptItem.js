const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');
const token = localStorage.getItem("token")
let currentItem
let expanded = false;
const params = new URLSearchParams(window.location.search);
const product = params.get('id');
if (product) {
  sessionStorage.setItem("pendingProductView", product);
}
let selectedProduct;

function appdateItem(itemData, categoryData) {
  document.getElementById("Product-Name").textContent = itemData[0].name;
  document.getElementById("Product-Price").textContent = itemData[0].price + " €";
  document.getElementById("Product-Description").textContent = itemData[0].description;
  document.getElementById("Product-image").src = itemData[0].image_url;
  document.getElementById("Product-Category").textContent = categoryData[0].name;

  getRating().then(average => {
    const av = average;
    document.getElementById("AverageRating").textContent = `⭐ ${av}/5`;
  });
  document.body.classList.remove("js-loading");
}

async function getRating() {
  try {
    const response = await fetch(`http://localhost:8000/average-rating/${currentItem.item_id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    const average = Number(parseFloat(data.average).toFixed(1));
    return isNaN(average) ? 0 : average;
  } catch (error) {
    console.error("Errore nel recupero del rating:", error);
    return null;
  }
}

function addToCart() {
  const token = localStorage.getItem("token");
  if (token != "" && token != null) {

    fetch(`http://localhost:8000/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ item_id: product, quantity: 1 })
    })
      .then(response => response.json())
      .then(Data => {
        innerNumCarts()
      })
      .catch(error => {
        console.error(error);
        document.getElementById("contenuto").textContent = "Errore: prodotto non trovato.";
      });
  } else {
    const not = document.getElementById("loggedCanvas")
    const offcanvas = new bootstrap.Offcanvas(not);
    offcanvas.show();
  }
}

function addToReview() {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:8000/reviews/${currentItem.item_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
  })
    .then(response => response.json())
    .then(Data => {
      const reviews = Data.reviews
      reviews.forEach(review => {
        createReview(review)
      })
    })
    .catch(error => {
      console.error(error);
      document.getElementById("contenuto").textContent = "Errore: prodotto non trovato.";
    });
}

function openModal() {
  if (token != "" && token != null) {
    document.getElementById("reportModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
  } else {
    const not = document.getElementById("loggedCanvas")
    const offcanvas = new bootstrap.Offcanvas(not);
    offcanvas.show();
  }
}

// Chiude la finestra del report
function closeModal() {
  document.getElementById("reportModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
}

// Manda il report se la descrizione è stata scritta 
function sendReport() {
  const selection = document.getElementById("type").value
  description = document.getElementById("description")

  // Previene il comportamento predefinito del form
  let valid = true;
  description.style.border = "";

  if (!description.value.trim()) {
    description.style.border = "2px solid red";
    valid = false;
  }
  if (!valid) {
    return;
  }
  description = description.value;
  const token = localStorage.getItem("token");
  const product = selectedProduct[0].item_id;

  fetch(`http://localhost:8000/create-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ item_id: product, category: selection, description: description })
  })

    .then(response => response.json())
    .then(Data => {
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
  closeModal();
}

function createReview(ReviewContent) {
  const container = document.getElementById("rowContainer");
  const wrapper = document.createElement("div");
  wrapper.className = "w-100 position-relative review-card mb-3";
  wrapper.style.backgroundColor = "#2c2c2c";
  wrapper.style.padding = "10px";
  wrapper.style.borderRadius = "10px";

  // Checkbox nascosta per la selezione
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "review-select position-absolute";
  checkbox.style.top = "10px";
  checkbox.style.right = "10px";
  checkbox.style.display = "none";
  wrapper.appendChild(checkbox);

  // Crea lo span per il nome
  const span = document.createElement("span");
  span.className = "w-100";
  span.style.color = "white";
  span.textContent = ReviewContent.name;

  // Crea la textarea disabilitata
  const textarea = document.createElement("textarea");
  textarea.className = "form-control w-100";
  textarea.textContent = ReviewContent.description
  textarea.setAttribute("aria-label", "With textarea");
  textarea.disabled = true;
  textarea.style.resize = 'none';

  // Aggiungi span e textarea al wrapper
  wrapper.appendChild(span);
  wrapper.appendChild(textarea);

  // Aggiungi il blocco al contenitore
  container.appendChild(wrapper);
}

// Crea per ogni reportTypes un'option che verra aggiunta alla select
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let product = params.get('id');

  // Se non c’è nel URL, prova da sessionStorage
  if (!product) {
    product = sessionStorage.getItem("pendingProductView");
  }
  if (localStorage.getItem("Admin") == "true") {
    adminView = document.getElementsByClassName("Admin")
    Array.from(adminView).forEach(element => {
      element.classList.remove("d-none");
    });
  }

  fetch(`http://localhost:8000/item/${product}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      selectedProduct = data.item
      currentItem = selectedProduct[0]
      appdateItem(data.item, data.category_name);

      if (currentItem.quantity == 0) {
        const button = document.getElementById("addedtoCart")
        button.classList.remove("shiny-blue-btn")
        button.classList.add("UsefullButton")
        button.disabled = true

      }
      addToReview()
      return fetch(`http://localhost:8000/userby/${currentItem.user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })
    .then(response => response.json())
    .then(data => {
      initProfile(data.user);
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
});

const reportTypes = [
  "Inappropriate content",
  "Spam or unsolicited advertising",
  "False or misleading information",
  "Counterfeit product",
  "Missing or incorrect image/description",
  "Safety concerns",
  "Copyright infringement",
  "Other (general report)"
];

const selectType = document.getElementById("type");
selectType.innerHTML = "";

reportTypes.forEach(type => {
  const option = document.createElement("option");
  option.value = type.toLowerCase().replace(/\s+/g, '-');
  option.textContent = type;
  selectType.appendChild(option);
});

function sendToArtisan() {
  window.location.href = `ArtisanCatalog.html?A=${currentItem.user_id}`
}

function initProfile(profile) {
  const nome = document.getElementById("nomeArtisan");
  const image = document.getElementById("imageprofile")
  nome.textContent = profile.name + " " + profile.surname
  image.src = profile.image_url
}

function deleteProduct() {
  if (confirm("Are you sure you want to delete this product?")) {

    fetch(`http://localhost:8000/delete-item/${currentItem.item_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(Data => {
        alert("Product deleted (demo)");
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error(error);
        document.getElementById("contenuto").textContent = "Errore: prodotto non rimosso";
      });
  }
}

function toggleReviewSelection() {
  const reviews = document.querySelectorAll('.review-card');
  reviews.forEach(card => {
    const checkbox = card.querySelector('.review-select');
    if (checkbox) {
      checkbox.style.display = checkbox.style.display === 'none' ? 'inline-block' : 'none';
    }
  });
  const anyVisible = [...document.querySelectorAll('.review-select')].some(cb => cb.style.display !== 'none');
  document.getElementById('deleteSelectedReviewsBtn').style.display = anyVisible ? 'inline-block' : 'none';
}

function deleteSelectedReviews() {
  const checkboxes = document.querySelectorAll('.review-select');
  let deleted = 0;
  checkboxes.forEach(cb => {

    if (cb.checked) {
      cb.closest('.review-card').remove();
      idReview = cb.closest('.review-card').id;
      deleted++;

      fetch(`http://localhost:8000/delete-review/${idReview}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(Data => {
          alert("Product deleted (demo)");
        })
        .catch(error => {
          console.error(error);
          document.getElementById("contenuto").textContent = "Errore: prodotto non rimosso";
        });
    }
  });

  if (deleted === 0) {
    alert("No reviews selected.");
  } else {
    alert(`${deleted} review(s) deleted.`);
  }
}
