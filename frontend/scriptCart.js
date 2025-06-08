localStorage.setItem("cart", JSON.stringify({ items: [] }));

let cart
const token = localStorage.getItem("token");

  window.addEventListener("DOMContentLoaded", () => {


  fetch("http://localhost:8000/cart",{

        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          
      })
      .then(response => response.json())
      .then(Data => {

       cart = Data.items 
       if (cart.length === 0) {
      document.getElementById("emptyCart").classList.remove("d-none");
      document.getElementById("fullCart").classList.add("d-none");
      
      return;
    }
    
    return Promise.all(cart.map(cartItem => getInfo(cartItem)))
      .then(() => {
        document.getElementById("emptyCart").classList.add("d-none");
        document.getElementById("fullCart").classList.remove("d-none");

        console.log(sessionStorage.getItem("cart"))
        updateCartReview(); 
        
      });
  })
  .catch(error => {
    console.error("Errore nel caricamento del carrello:", error);
    
  });
});


//crea i contenitori per il cart

function createCartElement(CartContent) {
  console.log("sono qui");
  const container = document.getElementById("item-container");

  const carItem = document.createElement("div");
  carItem.className = "col-12 cartItem d-flex";
  carItem.id = CartContent.item_id;

  // Immagine
  const img = document.createElement("img");
  img.src =  "golubirospiuniro.jpeg";
  img.classList.add("imgCart");

  // Div interno
  const innerDiv = document.createElement("div");
  innerDiv.className = "d-flex-column w-100 p-2";

  // Riga con titolo e input quantity
  const topRow = document.createElement("div");
  topRow.className = "d-flex";

  const h3 = document.createElement("h3");
  h3.textContent = CartContent.name;

  // Gruppo input quantità
  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group mb-3 ms-auto";
  inputGroup.style.width = "100%";
  inputGroup.style.maxWidth = "100px";

  const quantitySelector = document.createElement("div");
  quantitySelector.className = "quantity-selector d-flex align-items-center";

  const decreaseBtn = document.createElement("button");
  decreaseBtn.textContent = "−";
  decreaseBtn.type = "button";
  decreaseBtn.className = "btn btn-outline-secondary btn-sm incdec";

  const quantityInput = document.createElement("input");
  quantityInput.type = "text";
  quantityInput.value = CartContent.quantity;
  quantityInput.readOnly = true;
  quantityInput.id = CartContent.item_id;
  quantityInput.className = "form-control text-center p-1 ContItem";

  const increaseBtn = document.createElement("button");
  increaseBtn.textContent = "+";
  increaseBtn.type = "button";
  increaseBtn.className = "btn btn-outline-secondary btn-sm incdec";

  quantitySelector.appendChild(decreaseBtn);
  quantitySelector.appendChild(quantityInput);
  quantitySelector.appendChild(increaseBtn);
  inputGroup.appendChild(quantitySelector);

  // Eventi pulsanti
  decreaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityInput.value, 10);
    if (value > 1) {
      quantityInput.value = value - 1;
      const id = quantityInput.id
      const quantity = value-1
      
      fetch(`http://localhost:8000/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Upload riuscito:", data);
      updateCartReview()
    })
    .catch(error => {
      console.error("Errore durante l'upload:", error);
    });

    const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const itemIndex = cart.items.findIndex(item => item.item_id === id);
    if (itemIndex !== -1) {
    cart.items[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  });

  increaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityInput.value, 10);
    quantityInput.value = value + 1;
    const id = quantityInput.id
    const quantity = value+1
   
    fetch(`http://localhost:8000/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Upload riuscito:", data);
      updateCartReview()

    })
    .catch(error => {
      console.error("Errore durante l'upload:", error);
    });

    const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const itemIndex = cart.items.findIndex(item => item.item_id === id);
    if (itemIndex !== -1) {
    cart.items[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
      }
  });

  
  topRow.appendChild(h3);

  // Categoria
  const p = document.createElement("p");
  p.textContent = CartContent.category_id;

  // Prezzo
  const prezzo = document.createElement("p");
  prezzo.textContent = CartContent.price;

  // Bottone elimina
  const button = document.createElement("button");
  button.className = "icon-button";
  const icon = document.createElement("i");
  icon.className = "bi bi-trash";
  button.prepend(icon);

  document.getElementById("button-container").appendChild(button);

  button.addEventListener("click", () => {
    fetch(`http://localhost:8000/cart/${CartContent.item_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    }).then(response => {
      document.getElementById(CartContent.item_id).remove();
      updateCartReview();
      innerNumCarts();
    });
  });

  innerDiv.appendChild(topRow);      
  innerDiv.appendChild(p);           
  innerDiv.appendChild(prezzo);      
  innerDiv.appendChild(inputGroup);  
  innerDiv.appendChild(button);      

  // Assembla tutto
  carItem.appendChild(img);
  container.appendChild(carItem);
  carItem.appendChild(innerDiv);
 
}

function buyCart(){
  
  const cartItems = document.getElementsByClassName("cartItem");
  let total = 0;
  let nitems = 0;
  console.log("Aggiornamento carrello..." + cartItems.length);

  Array.from(cartItems).forEach(item => {
    const priceText = item.querySelector("p:nth-child(3)").textContent;
    const price = parseFloat(priceText.replace("€", ""));
    total += price;
    nitems++;
  });

  if(nitems!=0){
 window.location.href= "pay.html"
  }
 
      

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
    elementoPassed = elemento[0];
  
    const { image_url, prezzo, ...rest } = elementoPassed;

    const itemWithQuantity = {
      ...rest,
      quantity: product.quantity
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    
    cart.items.push(itemWithQuantity)

    localStorage.setItem("cart", JSON.stringify(cart));
    
    console.log(cart)

    createCartElement(itemWithQuantity);
  });
}

function updateCartReview() {
  const cartItems = document.getElementsByClassName("cartItem");

  let total = 0;
  let nitems = 0;

  console.log("Aggiornamento carrello..." + cartItems.length);

    Array.from(cartItems).forEach(item => {
    // Legge il prezzo
    const priceText = item.querySelector("p:nth-child(3)").textContent;
    const price = parseFloat(priceText.replace("€", "").trim());

    // Legge la quantità dal campo con classe ContItem
    const quantityInput = item.querySelector(".ContItem");
    const quantity = parseInt(quantityInput.value, 10);

    // Calcoli
    total += price * quantity;
    nitems += quantity;
  });

  // Aggiorna l'interfaccia
  document.getElementById("totalPrice").textContent = `€${total.toFixed(2)}`;
  document.getElementById("itemCount").textContent = nitems;

  console.log("Totale articoli:", nitems, " - Prezzo totale:", total);
}



