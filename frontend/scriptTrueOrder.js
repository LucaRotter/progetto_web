
const token = localStorage.getItem("token")

const parsed = JSON.parse(localStorage.getItem("infoClient"));

const itemsObj = JSON.parse(parsed.items);
console.log("Items reali:", itemsObj.items);


let address = parsed.address
let civic_number = parsed.civic_number
let postal_code = parsed.postal_code
let province = parsed.province
let country = parsed.country
let phone_number = parsed.phone_number


fetch(`http://localhost:8000/add-order`, {

  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ items: itemsObj.items, address: address, civic_number: civic_number, postal_code: postal_code, province: province, country: country, phone_number: phone_number })
})

  .then(response => response.json())
  .then(Data => {

    console.log(Data)

    fetch(`http://localhost:8000/delete-cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`

      }
    })
    sessionStorage.removeItem("infoClient");

  })
  .catch(error => {
    console.error(error);
    document.getElementById("contenuto").textContent = "Errore: prodotto non trovato.";
  });






//a casa