const token = sessionStorage.getItem("token");



  window.addEventListener("DOMContentLoaded", () => {

  fetch("http://localhost:8000/cart",{

        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          
      })
      .then(response => response.json())
      .then(Data => {

       if (Data.length === 0) {
      document.getElementById("emptyCart").classList.remove("d-none");
      document.getElementById("fullCart").classList.add("d-none");
      
      
      return;
    }
    
    return Promise.all(Data.map(cartItem => getInfo(cartItem)))
      .then(() => {
        document.getElementById("emptyCart").classList.add("d-none");
        document.getElementById("fullCart").classList.remove("d-none");

        updateCartReview(); 
        
      });
  })
  .catch(error => {
    console.error("Errore nel caricamento del carrello:", error);
    
  });
});


//crea i contenitori per il cart
function createCartElement(CartContent){
console.log("sono qui")
  const container = document.getElementById("item-container");
  
  const carItem = document.createElement("div");
  carItem.className = "col-12 cartItem d-flex";  
  carItem.id = CartContent.item_id;

  // Immagine
  const img = document.createElement("img");
  img.src = CartContent.image_url;
  img.classList.add("imgCart");
  
  // Div interno
  const innerDiv = document.createElement("div");
  innerDiv.className = "d-flex-column w-100 p-2";

  // Riga con titolo e select
  const topRow = document.createElement("div");
  topRow.className = "d-flex";

  const h3 = document.createElement("h3");
  h3.textContent = CartContent.name;

  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group mb-3 ms-auto";
  inputGroup.style.width = "100%";
  inputGroup.style.maxWidth = "80px";

  const select = document.createElement("select");
  select.className = "form-select w-100";
  select.id = CartContent.item_id;

  const optionDefault = document.createElement("option");
  optionDefault.selected = true;
  optionDefault.textContent = "1";
  select.appendChild(optionDefault);

  ["One", "Two", "Three"].forEach((text, i) => {
    const option = document.createElement("option");
    option.value = i + 1;
    option.textContent = text;
    select.appendChild(option);
  });

  inputGroup.appendChild(select);
  topRow.appendChild(h3);
  topRow.appendChild(inputGroup);

  // Paragrafi
  

  const p = document.createElement("p");
  p.textContent = CartContent.category_id;

  const prezzo = document.createElement("p");
  prezzo.textContent = CartContent.prezzo;

  // Bottone
  const button = document.createElement("button");
  const icon = document.createElement("i");
  icon.className = "bi bi-trash";
  button.appendChild(icon);

  button.addEventListener("click", () => {

    fetch(`http://localhost:8000/cart/${CartContent.item_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      
      }
    })
    .then(response => {
      document.getElementById(CartContent.item_id).remove();
      updateCartReview()
    })
  })

  carItem.appendChild(img);
  container.appendChild(carItem);
  carItem.appendChild(innerDiv);
  innerDiv.appendChild(topRow);
  innerDiv.appendChild(p);
  innerDiv.appendChild(prezzo);
  innerDiv.appendChild(button);

}

function buyCart(){
  window.location.href = "Pay.html"
}

function getInfo(product) {

  return fetch(`http://localhost:8000/item/${product.item_id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    elemento = data.item
    createCartElement(elemento[0]);
  });
}

function updateCartReview() {
  const cartItems = document.getElementsByClassName("cartItem");
  let total = 0;
  let nitems = 0;

  Array.from(cartItems).forEach(item => {
    const priceText = item.querySelector("p:nth-child(3)").textContent;
    const price = parseFloat(priceText.replace("€", ""));
    total += price;
    nitems++;
  });

  const totalElement = document.getElementById("totalPrice");
  totalElement.textContent = `€${total.toFixed(2)}`;

  const nitemsElement = document.getElementById("itemCount");
  nitemsElement.textContent = nitems;

  console.log("Totale articoli:", nitems, " - Prezzo totale:", total);
}