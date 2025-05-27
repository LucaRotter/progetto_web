
  window.addEventListener("DOMContentLoaded", () => {

    const token = sessionStorage.getItem("token");

  fetch("http://localhost:8000/cart",{

        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          
      })
      .then(response => response.json())
      .then(Data => {

          console.log(Data[0])
          Data.forEach(cartItem => {

              let prodotto = getInfo(cartItem)
              
          });

          document.body.classList.remove("js-loading");
          
      })

      document.getElementById("emptyCart").classList.add("d-none");
      document.getElementById("fullCart").classList.remove("d-none");
      document.getElementById("buttonCart").classList.remove("d-none");

})

//crea i contenitori per il cart
function createCartElement(CartContent){

  console.log("dati da aggiungere : " + CartContent)
  const container = document.getElementById("item-container");

  const carItem = document.createElement("div");
  carItem.className = "col-12 carItem d-flex";

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
  button.type = "submit";
  const icon = document.createElement("i");
  icon.className = "bi bi-trash";
  button.appendChild(icon);

  // Assembla tutto

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

function getInfo(product){

let prodotto;
fetch(`http://localhost:8000/item/${product.item_id}`, {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    console.log("Dati ricevuti:", data);
    createCartElement(data[0]);
})
.catch(error => {
    console.error("Si è verificato un errore:", error);
});


}