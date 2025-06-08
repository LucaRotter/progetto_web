

document.addEventListener("DOMContentLoaded", ()=>{

  const initalNItems= getCardCountByScreenWidth()
  fetch(`http://localhost:8000/random-items?nItems=${initalNItems}`, {
        headers: {
          'Content-Type': 'application/json',
          
        }
      })
    .then(Response => Response.json())
    .then(Data =>{
  
      console.log(Data)
      for(let i= 0; i<initalNItems;i++){
        
          const list = document.getElementById("ProductList")
          list.appendChild(ProductCreation(Data.selectedItems[i]))
          
      }

    })
})

let caricamentoInCorso= false
const params = new URLSearchParams(window.location.search);
const product = params.get('id');
console.log(product)


  $(window).on("scroll", function () {
    
    
if (caricamentoInCorso) return;

  const lastP = document.querySelector('#ProductList .col:last-child');

    const rect = lastP.getBoundingClientRect();

  if (rect.top < window.innerHeight) {
    
    Loadingcard();
  }

    
});

//creazione prodotto

function ProductCreation(Data){

caricamentoInCorso=false

const card = document.createElement('div');
card.className = 'col';
card.id = Data.item_id;
console.log(Data.id)
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

// 2. Assembla la struttura
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
    
    img.alt = '...';

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

  let CurrentDefault = []

  let dim= getCardCountByScreenWidth()

  for(let i= 0; i<dim;i++){
  let placeholder = CardPlaceholderCreation()
  contenitore.appendChild(placeholder)
  CurrentDefault.push(placeholder)

  }


  const NItems= getCardCountByScreenWidth();
  console.log(NItems)
  //fetch per il caricamento dei prodotti
  
   fetch(`http://localhost:8000/category-items/${product}?nItems=${NItems}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(Response => Response.json())
    .then(Data =>{

        let i = 0
        console.log(Data.selectedItems)

        CurrentDefault.forEach((element)=>{

        if(i < Data.selectedItems.length){
          const card = ProductCreation(Data.selectedItems[i]);
          element.replaceWith(card);
        }else{
          element.remove();
        }
        i++;

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
