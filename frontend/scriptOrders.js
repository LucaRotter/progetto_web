const token = localStorage.getItem("token")
let currentItem

window.addEventListener("DOMContentLoaded", () => {

  fetch("http://localhost:8000/customer-orders", {

    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },

  })
    .then(response => response.json())
    .then(Data => {

      const Ordini = Data.orders
      console.log(Data.orders)

      let i = 0

      Ordini.forEach(order => {
        console.log(order)
        getInfo(order)

        i++
      });
    }).catch(error => {
      console.error("Si è verificato un errore:", error);

    });
})

function getInfo(product) {

  return fetch(`http://localhost:8000/item/${product.item_id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      elemento = data.item
      console.log(elemento[0])

      console.log("get info " + data)
      createCartElement(elemento[0],  product);

    }).catch(error => {
      console.error("Si è verificato un errore:", error);

    });
}

function createCartElement(CartContent, product) {
  const container = document.getElementById("item-container");


  const carItem = document.createElement("div");
  carItem.className = "col-12 carItem";
  carItem.setAttribute("id", CartContent.item_id)


  const img = document.createElement("img");
  img.src = CartContent.image_url;
  carItem.appendChild(img);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const h3 = document.createElement("h3");
 

  const statusWrapper = document.createElement("div");
  statusWrapper.className = "status-wrapper";

  const statusDot = document.createElement("span");
  statusDot.className = "status-dot";
  statusWrapper.appendChild(statusDot);

  const statusText = document.createElement("span");
  statusText.className = "status-text";
  statusText.textContent = product.state ? "shipped" : "confirmed";
  statusWrapper.appendChild(statusText);

  if (product.state === "shipped") {
    statusDot.className = "status-dotnot not-shipped";
    statusText.textContent = "shipped";
  } else {
    statusDot.className = "status-dot shipped";
    statusText.textContent = "not shipped";
  }
   


  const inputQty = document.createElement("input");
  inputQty.className = "input-qty";
 
  inputQty.value = product.quantity;
  inputQty.readOnly = true;

  topRow.appendChild(statusWrapper);
  topRow.appendChild(inputQty);


  const name = document.createElement("p");
  name.textContent = CartContent.name;


  const price = document.createElement("p");
  price.textContent =  CartContent.price + " €" ;

  contentWrapper.appendChild(topRow);
  contentWrapper.appendChild(name);
  contentWrapper.appendChild(price);
  contentWrapper.appendChild(inputQty);


  const reviewBtn = document.createElement("button");
  reviewBtn.textContent = "Review";
  reviewBtn.className = "btn btn-outline-primary mt-2 align-self-start";
  reviewBtn.onclick = (e) => {
    const itemId = e.target.closest(".carItem").id;
    openModal(itemId);
  };
  contentWrapper.appendChild(reviewBtn);


  carItem.appendChild(contentWrapper);
  container.appendChild(carItem);
}


const description = document.getElementById("description");
const selectValutation = document.getElementById("valutation");

// Apre la finestra del report

function openModal(item) {

  currentItem = item
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
function sendReview(event) {
  event.preventDefault()
  let description = document.getElementById("description");
  let evaluation = document.getElementById("valutation")
  console.log(description, evaluation)
  let valid = true;
  description.style.border = "";

  if (!description.value.trim()) {
    description.style.border = "2px solid red";
    valid = false;
  }
  if (!valid) {
    return;
  }



  description = description.value
  evaluation = evaluation.value

  const numero = parseInt(evaluation.charAt(evaluation.length - 1), 10);

fetch("http://localhost:8000/add-review", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    item_id: currentItem,
    description: description,
    evaluation: numero
  })
})
.then(response => {
  if (response.status === 400) {
    alert("Hai già inserito una recensione per questo articolo.");
    throw new Error("Recensione già esistente");
  }
  return response.json();
})
.then(data => {
  console.log(data);
  closeModal();
})
.catch(error => {
  console.error("Si è verificato un errore:", error);
});
}


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
    selectValutation.appendChild(option);
  });
});