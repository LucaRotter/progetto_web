let CartContent = [{id:123,categoria:"vestiti",nome:"Dario" ,prezzo:"20€"},
  {id:124,categoria:"prova",nome:"mario" ,prezzo:"20€"}]

  window.addEventListener("DOMContentLoaded", () => {
  if (CartContent && CartContent.length > 0) {

  document.body.classList.remove("js-loading");
    for (let i = 0; i < CartContent.length; i++) {
      
      createCartElement(CartContent[i]); // passa i dati se servono
    }

    document.getElementById("emptyCart").classList.add("d-none");
    document.getElementById("fullCart").classList.remove("d-none");
    
  }else{

    document.body.classList.remove("js-loading");
  }
})

  
  

function createCartElement(CartContent){

  const container = document.getElementById("item-container");

  // Wrapper principale per l'item carrello
  const carItem = document.createElement("div");
  carItem.className = "col-12 carItem d-flex align-items-start";

  // Div responsive per l'immagine (a sinistra)
  const imgWrapper = document.createElement("div");
  imgWrapper.style.maxWidth = "120px";
  imgWrapper.style.width = "100%";
  imgWrapper.className = "me-3"; // margine a destra per separare dall'altro div

  const img = document.createElement("img");
  img.src = "golubirospiuniro.jpeg";
  img.classList.add("imgOrder");
  img.style.width = "100%";
  img.style.height = "auto";
  img.style.objectFit = "contain";

  imgWrapper.appendChild(img);

  // Div delle specifiche (a destra)
  const innerDiv = document.createElement("div");
  innerDiv.className = "d-flex flex-column w-100 p-2";

  // Riga con titolo e input
  const topRow = document.createElement("div");
  topRow.className = "d-flex align-items-center";

  const h3 = document.createElement("h3");
  h3.textContent = CartContent.categoria;
  h3.className = "mb-0";

  // Input quantità (readonly)
  const inputGroup = document.createElement("input");
  inputGroup.className = "input-group mb-3 ms-auto";
  inputGroup.value = 3; // ad esempio 3 prodotti ordinati
  inputGroup.style.textAlign = "center";
  inputGroup.readOnly = true;
  inputGroup.style.width = "100%";
  inputGroup.style.maxWidth = "80px";

  // Selettore (se serve)
  const select = document.createElement("select");
  select.className = "form-select w-100";
  select.id = "";

  // Se vuoi aggiungere il select all'inputGroup, decommenta la riga sotto
  // inputGroup.appendChild(select);

  topRow.appendChild(h3);
  topRow.appendChild(inputGroup);

  // Paragrafi
  const nome = document.createElement("p");
  nome.textContent = CartContent.nome;

  const prezzo = document.createElement("p");
  prezzo.textContent = CartContent.prezzo;

  // Assembla tutto
  carItem.appendChild(imgWrapper); // immagine a sinistra
  carItem.appendChild(innerDiv);   // specifiche a destra
  container.appendChild(carItem);

  innerDiv.appendChild(topRow);
  innerDiv.appendChild(nome);
  innerDiv.appendChild(prezzo);
  
}


// funzione per spostare barra sopra dopo un minimo di grandezza 

