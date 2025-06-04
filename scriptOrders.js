let CartContent = [{id:123,categoria:"vestiti",nome:"Dario" ,prezzo:"20€"},
  {id:124,categoria:"prova",nome:"mario" ,prezzo:"20€"}]

  window.addEventListener("DOMContentLoaded", () => {
  if (CartContent && CartContent.length > 0) {

  document.body.classList.remove("js-loading");
    for (let i = 0; i < CartContent.length; i++) {
      
      createCartElement(CartContent[i]);
    }

    document.getElementById("emptyCart").classList.add("d-none");
    document.getElementById("fullCart").classList.remove("d-none");
    
  }else{

    document.body.classList.remove("js-loading");
  }
})

  
  
function createCartElement(CartContent) {
  const container = document.getElementById("item-container");

  const carItem = document.createElement("div");
  carItem.className = "col-12 carItem";

  const img = document.createElement("img");
  img.src = "golubirospiuniro.jpeg";
  carItem.appendChild(img);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const h3 = document.createElement("h3");
  h3.textContent = CartContent.categoria;

  const inputQty = document.createElement("input");
  inputQty.className = "input-qty";
 inputQty.style.marginTop = "-5px";
  inputQty.value = 3;
  inputQty.readOnly = true;

topRow.appendChild(h3);
topRow.appendChild(inputQty);

  const name = document.createElement("p");
  name.textContent = CartContent.nome;

  const price = document.createElement("p");
  price.textContent = CartContent.prezzo;

  contentWrapper.appendChild(topRow);
  contentWrapper.appendChild(name);
  contentWrapper.appendChild(price);
  contentWrapper.appendChild(inputQty);  


const reviewBtn = document.createElement("button" );
reviewBtn.textContent = "Review";
 reviewBtn.className = "btn btn-outline-primary mt-2 align-self-start";
reviewBtn.onclick = openModal;

contentWrapper.appendChild(reviewBtn);

  carItem.appendChild(contentWrapper);
  container.appendChild(carItem);
}


const description = document.getElementById("description");
const selectValutation = document.getElementById("valutation");

// Apre la finestra del report
function openModal() {
  document.getElementById("commentModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
}


// Chiude la finestra del report
function closeModal() {
  document.getElementById("commentModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  description.value = "";
  description.style.border = "";
  selectValutation.selectedIndex = 0;
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
    selectType.selectedIndex = 0;
    closeModal();
  }



// Crea per ogni reportTypes un'option che verra aggiunta alla select
document.addEventListener("DOMContentLoaded", () => {
  const valutationType = [
    "⭐ 1",
    "⭐⭐ 2",
    "⭐⭐⭐ 3", 
    "⭐⭐⭐⭐ 4",
    "⭐⭐⭐⭐⭐ 5",
  ];

  const selectValutation = document.getElementById("valutation");
  valutationType.innerHTML = ""; 

  valutationType.forEach(type => {
    const option = document.createElement("option");
    option.value = type.toLowerCase().replace(/\s+/g, '-');
    option.textContent = type;
    selectValutation .appendChild(option);
  });
});