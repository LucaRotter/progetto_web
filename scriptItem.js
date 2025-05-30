const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');

let expanded = false;


const params = new URLSearchParams(window.location.search);
const product = params.get('id');
console.log("ID ricevuto:",product);

fetch(`http://localhost:8000/item/${product}`, {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    console.log("Dati ricevuti:", data);
    appdateItem(data);
})
.catch(error => {
    console.error("Si è verificato un errore:", error);
});


function appdateItem(data) {
    document.getElementById("Product-Name").textContent = data[0].name;
    document.getElementById("Product-Price").textContent = data[0].prezzo + " €";
    document.getElementById("Product-Description").textContent = data[0].descrizione;
    document.body.classList.remove("js-loading");
}

function addToCart(){

const token = sessionStorage.getItem("token");

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

  console.log(Data)
    
  })
  .catch(error => {
    console.error(error);
    document.getElementById("contenuto").textContent = "Errore: prodotto non trovato.";
  });

}

// Apre la finestra del report
function openModal() {
  document.getElementById("reportModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
}


// Chiude la finestra del report
function closeModal() {
  document.getElementById("reportModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
}


// Manda il report se la descrizione è stata scritta 
function sendReport() {
    const description = document.getElementById("description");

    let valid = true;
    description.style.border = "";

    if (!description.value.trim()) {
      description.style.border = "2px solid red";
      valid = false;
    }
    if (!valid) {
      return; 
    }
    description.value = "";
    closeModal();
  }



// Crea per ogni reportTypes un'option che verra aggiunta alla select
document.addEventListener("DOMContentLoaded", () => {
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
});