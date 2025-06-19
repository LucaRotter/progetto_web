const token = localStorage.getItem("token");
let caricamentoInCorso = false;
const params = new URLSearchParams(window.location.search);
const product = params.get('id');

document.addEventListener("DOMContentLoaded", () => {

  let name = document.getElementById("category-NAME")
  name.textContent = product

  const initalNItems = getCardCountByScreenWidth();
  console.log("davide gay")

  fetch(`http://localhost:8000/category-items/${product}?nItems=${initalNItems}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    }
  })
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < initalNItems; i++) {
        const list = document.getElementById("ProductList");
        list.appendChild(ProductCreation(data.selectedItems[i]));
      }
    });
});

// Scroll listener
function onScrollHandler() {
  if (caricamentoInCorso) return;

  const last = document.querySelector('#ProductList .col:last-child');
  if (!last) return;
  const rect = last.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    Loadingcard();
  }
}
window.addEventListener("scroll", onScrollHandler);

// Funzione creazione card prodotto
function ProductCreation(Data) {
  caricamentoInCorso = false;

  const card = document.createElement('div');
  card.className = 'col';
  card.id = Data.item_id;
  card.setAttribute('onclick', `window.location.href='ViewProduct.html?id=${Data.item_id}'`);

  const cardStructure = document.createElement('div');
  cardStructure.className = 'card product-item';

  const img = document.createElement('img');
  img.src = Data.image_url;
  img.className = 'card-img-top img-card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex-column w-100 p-2';

  const title = document.createElement('p');
  title.className = 'card-text text-truncate mb-0 Item-Name';
  title.textContent = Data.name;

  const price = document.createElement('p');
  price.className = 'card-text Items price-Item';
  price.textContent = Data.price +  " €";

  cardBody.appendChild(title);
  cardBody.appendChild(price);

  cardStructure.appendChild(img);
  cardStructure.appendChild(cardBody);
  card.appendChild(cardStructure);

  return card;
}

// Funzione per creare un placeholder
function CardPlaceholderCreation() {
  const card = document.createElement('div');
  card.className = 'col';

  const cardStructure = document.createElement('div');
  cardStructure.className = 'card product-item';
  cardStructure.setAttribute('aria-hidden', 'true');

  const img = document.createElement('div');
  img.className = 'card-img-top placeholder-glow';
  img.style.height = '180px';
  img.style.backgroundColor = '#e0e0e0';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('p');
  title.className = 'card-title placeholder-glow';
  const titleSpan = document.createElement('span');
  titleSpan.className = 'placeholder col-6';
  title.appendChild(titleSpan);

  const text = document.createElement('p');
  text.className = 'card-text placeholder-glow';
  ['col-7', 'col-4'].forEach(classe => {
    const span = document.createElement('span');
    span.className = 'placeholder ' + classe;
    text.appendChild(span);
  });

  body.appendChild(title);
  body.appendChild(text);

  cardStructure.appendChild(img);
  cardStructure.appendChild(body);
  card.appendChild(cardStructure);

  return card;
}

// Lazy loading con gestione fine prodotti
function Loadingcard() {
  caricamentoInCorso = true;
  const contenitore = document.getElementById('ProductList');
  const nItems = getCardCountByScreenWidth();

  const placeholders = [];
  for (let i = 0; i < nItems; i++) {
    const placeholder = CardPlaceholderCreation();
    contenitore.appendChild(placeholder);
    placeholders.push(placeholder);
  }

  fetch(`http://localhost:8000/category-items/${product}?nItems=${nItems}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    }
  })
    .then(response => response.json())
    .then(data => {
      const items = data.selectedItems;

      placeholders.forEach((ph, index) => {
        if (index < items.length) {
          const card = ProductCreation(items[index]);
          ph.replaceWith(card);
        } else {
          ph.remove();
        }
      });

      // Se non ci sono più articoli da caricare, rimuove il listener
      if (items.length < nItems) {
        window.removeEventListener("scroll", onScrollHandler);
      }

      caricamentoInCorso = false;
    })
    .catch(err => {
      console.error("Errore durante il caricamento:", err);
      placeholders.forEach(ph => ph.remove());
      caricamentoInCorso = false;
    });
}

// Calcolo del numero di card in base allo schermo
function getCardCountByScreenWidth() {
  const width = window.innerWidth;
  if (width < 600) return 4;
  else if (width < 1000) return 9;
  else return 12;
}

window.addEventListener("beforeunload", () => {

  fetch(`http://localhost:8000/reset-category-items/${product}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    },
    keepalive: true
  })
})