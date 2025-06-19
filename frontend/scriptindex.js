let caricamentoInCorso = false
let token = localStorage.getItem("token")

//inizializzazione elementi
document.addEventListener('DOMContentLoaded', function () {

  //inizializza un numero varabile di carte in base alla dimensione dello schermo
  const initalNItems = getCardCountByScreenWidth()
  fetch(`http://localhost:8000/random-items?nItems=${initalNItems}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    }
  })

    .then(Response => Response.json())
    .then(Data => {
      for (let i = 0; i < initalNItems; i++) {
        const list = document.getElementById("ProductList")
        list.appendChild(ProductCreation(Data.selectedItems[i]))
      }
    })
});

//funzione per mostrare l'elemento offcanvas al click del bottone
function sing() {
  document.getElementById('singButton').addEventListener('click', function () {
    var offcanvasExample = new bootstrap.Offcanvas(document.getElementById("offcanvasExample"));
    offcanvasExample.show();
  });
}



//eventListener resettare lo shuffled all'uscita della pagina 
window.addEventListener("beforeunload", () => {

  //fetch per il reset
  fetch("http://localhost:8000/reset-items", {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    },
    keepalive: true
  })
})

//funzione che seleziona l'ultima card di quelle displayed
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

//creazione prodotto da inserire nella row
function ProductCreation(Data) {
  caricamentoInCorso = false
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
  price.textContent = Data.price + " €";

  cardBody.appendChild(title);
  cardBody.appendChild(price);

  cardStructure.appendChild(img);
  cardStructure.appendChild(cardBody);

  card.appendChild(cardStructure)

  return card;

}

// funzione per la creazione di un placeholder temporaneo
function CardPlaceholderCreation() {

  const card = document.createElement('div');
  card.className = 'col';

  const cardStructure = document.createElement('div');
  cardStructure.className = 'card product-item';
  cardStructure.setAttribute('aria-hidden', 'true');

  const img = document.createElement('img');
  img.className = 'card-img-top';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title placeholder-glow';

  const titleSpan = document.createElement('span');
  titleSpan.className = 'placeholder col-6';
  title.appendChild(titleSpan);

  const text = document.createElement('p');
  text.className = 'card-text placeholder-glow';
  ['col-7', 'col-4', 'col-4', 'col-6', 'col-8'].forEach(classe => {
    const span = document.createElement('span');
    span.className = 'placeholder ' + classe;
    text.appendChild(span);
  });

  body.appendChild(title);
  body.appendChild(text);
  cardStructure.appendChild(img);
  cardStructure.appendChild(body);
  card.appendChild(cardStructure)
  return card;
}


//funzione per il caricamento dei prodotti utilizzando un appproccio lazyloading

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
  const NItems = getCardCountByScreenWidth();
  //fetch per il caricamento dei prodotti

  fetch(`http://localhost:8000/random-items?nItems=${NItems}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'authorization': `Bearer ${token}` })
    }
  })
    .then(Response => Response.json())
    .then(Data => {
      const items = Data.selectedItems;
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

//inizializza una card-category 
//funzione per stabilire le card da inserire in base alla dimensione dello schermo 
function getCardCountByScreenWidth() {
  const width = window.innerWidth;
  if (width < 600) return 4;
  else if (width < 800) return 9;
  else return 12;
}

fetch(`http://localhost:8000/categories`, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(Response => Response.json())
  .then(Data => {
    generateCarouselItems(Data);
  })

function createCard(card) {
  return `
    <div class="card category-card" onclick="window.location.href='Categories.html?id=${encodeURIComponent(card.name)}'" style="cursor:pointer;">
      <img src="${card.image_url}" class="card-img-top" alt="${card.name}">
      <div class="card-body">
        <h5 class="card-title">${card.name}</h5>
      </div>
    </div>`
    ;
}

function generateCarouselItems(cardsData) {
  const container = document.getElementById('carouselInner');
  container.innerHTML = '';
  const isMobile = window.innerWidth < 600;
  if (isMobile) {
    cardsData.forEach((card, index) => {
      container.innerHTML +=
        `<div class="carousel-item ${index === 0 ? 'active' : ''}">
          ${createCard(card)}
        </div>`
        ;
    });
  } else {
    for (let i = 0; i < cardsData.length; i += 3) {
      const group = cardsData.slice(i, i + 3).map(createCard).join('');
      container.innerHTML +=
        `<div class="carousel-item ${i === 0 ? 'active' : ''}">
          <div class="cards-wrapper">${group}</div>
        </div>`
        ;
    }
  }
}

// Quando la finestra si ridimensiona, rigenera il carousel → serve salvare i dati
let globalCardsData = [];

window.addEventListener('resize', () => {
  if (globalCardsData.length > 0) {
    generateCarouselItems(globalCardsData);
  }
});

// Aggiorno i dati globali dopo aver ricevuto il fetch

fetch(`http://localhost:8000/categories`, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    globalCardsData = data;
    generateCarouselItems(globalCardsData);
  });