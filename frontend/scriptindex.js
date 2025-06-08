let caricamentoInCorso= false
let token = localStorage.getItem("token")
console.log(localStorage.getItem("token"))



//funzione per mostrare l'elemento offcanvas al click del bottone
function sing(){
document.getElementById('singButton').addEventListener('click', function () {
    
    var offcanvasExample = new bootstrap.Offcanvas(document.getElementById("offcanvasExample"));
    offcanvasExample.show();
});}

function logged(event){

    event.preventDefault()
    console.log("Login function")

    
    let email = document.getElementById("emailfield").value;
    let password = document.getElementById("passwordfield").value;
    let ruolo = localStorage.getItem("ruolo")
    console.log(ruolo)
    

    console.log(email,password,ruolo)
    
    fetch('http://localhost:8000/login', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, pwd: password, role: ruolo })
      })
      .then(response => response.json())
      .then(Data => {

       if(Data.token == null){
        
        alert("Credenziali non valide, riprova");
        return;
        
       }else{

       localStorage.setItem("modalità", ruolo)
       localStorage.setItem("token", Data.token)
       sessionStorage.setItem("loginSuccess", "true")
       console.log("urra")
       }
       
       if(ruolo=="C"){
       
       window.location.href = "index.html"
       return
        
       }else if(ruolo== "A"){
        window.location.href = "ManageProduct.html"
         return;
       }
        
    })
      .catch(error => {
        console.error('Error:', error);
        alert("Si è verificato un errore durante il login");
    })

}     
document.addEventListener('DOMContentLoaded', function () {



if (sessionStorage.getItem("loginSuccess") == "true") {
      // Mostra l'alert
      const alertDiv = document.getElementById("alertsucces");
      alertDiv.classList.remove("d-none");

      setTimeout(() => {
        alertDiv.classList.add("d-none");
        }, 5000);

        sessionStorage.removeItem("loginSuccess")
    }
  
  const initalNItems= getCardCountByScreenWidth()
  fetch(`http://localhost:8000/random-items?nItems=${initalNItems}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'authorization': `Bearer ${token}` })
        }
      })
    .then(Response => Response.json())
    .then(Data =>{

      for(let i= 0; i<initalNItems;i++){
        
          const list = document.getElementById("ProductList")
          list.appendChild(ProductCreation(Data.selectedItems[i]))
          
      }

    })

  
});



token = localStorage.getItem("token");
console.log(token)
window.addEventListener("beforeunload", () => {
   
    fetch("http://localhost:8000/reset-items", {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
       ...(token && { 'authorization': `Bearer ${token}` })
    },
    keepalive: true
    })
  })


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
price.textContent = "€ " + Data.price;

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
  const nItems = getCardCountByScreenWidth();

  const placeholders = [];
  for (let i = 0; i < nItems; i++) {
    const placeholder = CardPlaceholderCreation();
    contenitore.appendChild(placeholder);
    placeholders.push(placeholder);
  }


  const NItems= getCardCountByScreenWidth();
  //fetch per il caricamento dei prodotti

  fetch(`http://localhost:8000/random-items?nItems=${NItems}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'authorization': `Bearer ${token}` })
        }
      })
    .then(Response => Response.json())
    .then(Data =>{

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
function initCardCategory(Data) {

    const categoryCard = document.getElementsByClassName("category-card")
    console.log(Data[0])
   
  for (let i = 0; i < categoryCard.length; i++) {
  categoryCard[i].getElementsByClassName('card-title')[0].textContent = Data[i].name;
  categoryCard[i].getElementsByClassName('card-img-top')[0].src = Data[i].image_url;

  categoryCard[i].setAttribute('onclick', `window.location.href='Categories.html?id=${Data[i].name}'`)
    
  
  } 
}
  
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
    .then(Data =>{
      
      initCardCategory(Data)
    
    })
  


