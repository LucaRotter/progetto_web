
let caricamentoInCorso= false

//login function

function logged(event){

    console.log("Login function")
    
    event.preventDefault()
    let email = document.getElementById("emailfield").value;
    let password = document.getElementById("passwordfield").value;
    let ruolo;

    if($("#btnradio1").is(":checked")){
        ruolo="C"
    }else{
        ruolo="A"
    }

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
            
       console.log("questo è il ruolo " +  Data.token)  
       sessionStorage.setItem("modalità", ruolo)
       sessionStorage.setItem("token", Data.token)
       sessionStorage.setItem("loginSuccess", "true")
        
       window.location.href = "index.html";
        
    })
      .catch(error => {
        console.error('Error:', error);
        alert("Si è verificato un errore durante il login");
    })


}

//funzione per settare il testo nella schermata di registrazione
function reg(){
document.getElementById('linkreg').addEventListener('click',function(){

    if($('#btnradio2').is(':checked')){
        testo = "Welcome to our site<br>Register yourself as Artisan here"
    }else{
        testo = "Welcome to our site<br>Register yourself as Client here"
    }
    
    sessionStorage.setItem("registrationMsg", testo);
   
})
}


//funzione per mostrare l'elemento offcanvas al click del bottone
function sing(){
document.getElementById('singButton').addEventListener('click', function () {
    
    var offcanvasExample = new bootstrap.Offcanvas(document.getElementById("offcanvasExample"));
    offcanvasExample.show();
});}

//funzione prendere il valore del campo di ricerca e mostrare il risultato 

function search(){
document.getElementById("primarysearchform").addEventListener("submit", function (event) {

    event.preventDefault(); 
    const searchQuery = $("#searchfield").val(); 
    this.reset(); 

})
}

function setMessage() {

    sessionStorage.setItem("registrationMsg", "Benvenuto nella pagina di registrazione!");
}       

    const items= $('.product-item'); 

    const prova = [
    {name:"Maglietta", id:"230", prezzo:100},
    {name:"camicia",  id:"231", prezzo:101},
    {name:"jeans",  id:"232", prezzo:2}
  ]

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
})


let prevScroll = $(window).scrollTop();

// utilizzato per

$(window).on("scroll", function () {
    const currentScroll = $(this).scrollTop();

    if (currentScroll > prevScroll && currentScroll > 100) {
       
        $("#header").css("top", "-100px");
    } else if (currentScroll < prevScroll) {
    
        $("#header").css("top", "0");
    }
    prevScroll = currentScroll;
});

//utilizzato per nascondere la barra di navigazione quando si scorre verso il basso e mostrarla quando si scorre verso l'alto e per la comparsa di nuovi elementi nel main


$(window).on("scroll", function () {
    
    
if (caricamentoInCorso) return;

  const lastP = document.querySelector('#ProductList .col:last-child');

    const rect = lastP.getBoundingClientRect();

  if (rect.bottom + 20 < window.innerHeight) {

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
card.setAttribute('onclick', `window.location.href='visualizzaprodotto.html?id=${Data.item_id}'`); 

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
price.className = 'card-text Items prezzo-Item';
price.textContent = Data.prezzo;

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

  //inizializza una card-category 
  function initCardCategory(Data) {

    const categoryCard = ddocument.getElementsByClassName(category-card)
    
    categoryCard.forEach((element) => {
      
      element.getElementsByClassName('card-title')[0].textContent = Data.category;
      element.getElementsByClassName('card-img-top')[0].src = Data.image_url;
      
    })
  }

  const NItems= getCardCountByScreenWidth();
  //fetch per il caricamento dei prodotti

  fetch(`http://localhost:8000/random-items?nItems=${NItems}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(Response => Response.json())
    .then(Data =>{

      i=0

      CurrentDefault.forEach((element)=>{

        if(i < Data.length){
          const card = ProductCreation(Data[i]);
          element.replaceWith(card);
        }else{
          element.remove();
        }
        i++;

    })
  })
}

fetch(`http://localhost:8000/random-items?nItems=${NItems}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(Response => Response.json())
    .then(Data =>{

      initCardCategory(Data)

    })
  

  //funzione per stabilire le card da inserire in base alla dimensione dello schermo 

  function getCardCountByScreenWidth() {
  const width = window.innerWidth;
  if (width < 600) return 4;
  else if (width < 1024) return 9;
  else return 12;

}
