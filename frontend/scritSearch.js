let caricamentoInCorso = false
const params = new URLSearchParams(window.location.search);
const product = params.get('id');
console.log(product)

document.addEventListener("DOMContentLoaded", () => {
  Loadingcard()
})



//creazione prodotto
function ProductCreation(Data) {

  const row = document.getElementById("ProductList")
  const card = document.createElement('div');
  card.className = 'col';
  card.id = Data.item_id;
  card.setAttribute('onclick', `window.location.href='ViewProduct.html?id=${Data.item_id}'`);

  const cardStructure = document.createElement('div');
  cardStructure.className = 'card product-item';

  const img = document.createElement('img');
  img.src = Data.image_url;
  img.className = 'card-img-top img-card';
  //img.alt = Data.image.alt;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex-column w-100 p-2';

  const title = document.createElement('p');
  title.className = 'card-text text-truncate mb-0 Item-Name';
  title.textContent = Data.name;

  const price = document.createElement('p');
  price.className = 'card-text Items price-Item';
  price.textContent = Data.price;

  cardBody.appendChild(title);
  cardBody.appendChild(price);

  cardStructure.appendChild(img);
  cardStructure.appendChild(cardBody);

  card.appendChild(cardStructure)
  row.appendChild(card)


}


//funzione per il caricamento dei prodotti utilizzando un appproccio lazyloading

function Loadingcard() {


  const params = new URLSearchParams(window.location.search);
  console.log(params)

  // Legge categorie multiple 
  const categories = params.getAll("categories[]");

  // Legge singoli parametri
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minEvaluation = params.get("minEval");
  const name = params.get("search")

  console.log("Categorie:", categories[0]);
  console.log("Prezzo minimo:", minPrice);
  console.log("Prezzo massimo:", maxPrice);
  console.log("Valutazione minima:", minEvaluation);
  console.log("campo ricerca", name)


  // 👉 Da qui puoi lanciare una fetch:
  const query = new URLSearchParams();
  if (name) query.append("name", name);
  categories.forEach(cat => query.append("category", cat));
  if (minPrice) query.append("minPrice", minPrice);
  if (maxPrice) query.append("maxPrice", maxPrice);
  if (minEvaluation) query.append("minEvaluation", minEvaluation);


  //fetch per il caricamento dei prodotti

  fetch(`http://localhost:8000/items?${query}`, {

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(Response => Response.json())
    .then(Data => {

      Data.items.forEach(item => {

        console.log(item.name)
        ProductCreation(item);
      })


    })
}


//funzione per stabilire le card da inserire in base alla dimensione dello schermo 

function getCardCountByScreenWidth() {
  const width = window.innerWidth;
  if (width < 600) return 4;
  else if (width < 1000) return 9;
  else return 12;

}