const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');

let expanded = false;

function changeImage(img) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = img.src;

    document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
    img.classList.add('active');
}

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



