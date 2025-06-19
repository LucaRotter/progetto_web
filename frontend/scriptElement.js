document.addEventListener('DOMContentLoaded', () => {
 // verifica il primo avvio

 console.log("davide gay")
 if (!sessionStorage.getItem("firstVisit")) {
    localStorage.clear();
    sessionStorage.setItem("firstVisit", "true");
 }

 for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`post clear :  ${key}: ${value}`);
}

  //fetch che recupera la navbar
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
      const desktopFilters = document.querySelector('.dropdown-menu[aria-labelledby="filterDropdown"]');
      const mobileFiltersContainer = document.getElementById('mobileFiltersContainer');

      if (desktopFilters && mobileFiltersContainer) {
        mobileFiltersContainer.innerHTML = desktopFilters.innerHTML;
        const allInputs = mobileFiltersContainer.querySelectorAll('[id]');
        allInputs.forEach(el => {
          const oldId = el.id;
          const newId = oldId + '-mobile';
          el.id = newId;
          const label = mobileFiltersContainer.querySelector(`label[for="${oldId}"]`);
          if (label) {
            label.setAttribute('for', newId);
          }
        });
      }


      const radios = document.querySelectorAll('input[name="ruolo"]');
      let selected = Array.from(radios).find(radio => radio.checked);

      let ruolo = selected ? selected.value : "C";
      localStorage.setItem("ruolo", ruolo);
      console.log("Ruolo iniziale salvato:", ruolo);


      radios.forEach(function (radio) {
        radio.addEventListener("change", function () {
          if (this.checked) {
            localStorage.setItem("ruolo", this.value);
            console.log("Ruolo cambiato:", this.value);
          }
        });
      });

    const mod = localStorage.getItem("modalità")
    const token = localStorage.getItem("token")
    let artisan = document.querySelectorAll('.loggedArtisan')
    let notlogged = document.querySelectorAll('.notLogged')
    let logged = document.querySelectorAll('.loggedUser')


    console.log(artisan)
    console.log(notlogged)
    console.log(logged)

    if (mod == "C" && token != null) {
      console.log("eseguo")
      notlogged.forEach(el => el.classList.add("d-none"))
      artisan.forEach(el => el.classList.add("d-none"))
      logged.forEach(el => el.classList.remove("d-none"))


    } else if (mod == "A" && token != null) {

      notlogged.forEach(el => el.classList.add("d-none"))
      logged.forEach(el => el.classList.add("d-none"))
      artisan.forEach(el => el.classList.remove("d-none"))


    } else {

      artisan.forEach(el => el.classList.add("d-none"))
      logged.forEach(el => el.classList.add("d-none"))
      notlogged.forEach(el => el.classList.remove("d-none"))


    }

      updateNavbarLogoLink();
      setupSearchForm()
      iniImg()
      innerNumCarts()
      reg()
      loggin()
      togglePage()

      document.body.classList.remove("js-loading")

    })
    .catch(err => {
      console.error("Errore nel caricamento della navbar:", err);
    });

})

function innerNumCarts() {
  let mod = localStorage.getItem("modalità")

  if (mod == "C") {
    const token = localStorage.getItem('token')
    console.log("il mio toke d'accesso" + token)
    fetch('http://localhost:8000/cart-count', {

      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(Response => Response.json())
      .then(Data => {

        numberofItems = Data.count
        badges = Array.from(document.querySelectorAll(".cart-badged"))


        badges.forEach(badge => {
          if (numberofItems > 0) {

            badge.textContent = numberofItems;
            badge.classList.remove('d-none')

          } else {

            badge.classList.add('d-none')
          }

        })


      })
      .catch(error => {
        console.error("Errore nel recupero del carrello:", error);
        document.getElementById("cart-badge").style.display = "none";
      });

  }
}

function ShipPage() {
  window.location.href = "shipPage.html"
}

function Userpage() {
  window.location.href = "User.html"
}

function Cartpage() {
  window.location.href = "cart.html"
}

function Orderspage() {
  window.location.href = "Orders.html"
}
function togglePage() {
  const btn = document.getElementById("togglePageBtn");
  const currentPage = window.location.pathname;

  if (btn) {
    if (currentPage.includes("ManageProduct")) {
      btn.textContent = "Other Product";
    } else {
      btn.textContent = "Manage Product";
    }
  }
}

function IndexPage() {
  const currentPage = window.location.pathname;
  if (currentPage.includes("ManageProduct")) {
    window.location.href = "index.html";
  } else {
    window.location.href = "ManageProduct.html";
  }
}


function Items() {
  window.location.href = "index.html"
}


function view() {
  const modal = document.getElementById('modalView');
  if (modal) {
    modal.style.display = 'block';
    modal.classList.add('show');
  }
}

function logout() {

  localStorage.setItem("modalità", "");
  localStorage.setItem("token", "");
  localStorage.setItem("loginSuccess", "false");

  window.location.href = "index.html"

}

function setupSearchForm() {
  const form = document.getElementById("primarysearchform");
  const formmobile = document.getElementById("mobileSearchForm")

  if (!formmobile) {
    console.error("Form non trovata!");
    return;
  }
  console.log("Form trovata!", formmobile);

  formmobile.addEventListener("submit", function (event) {
    event.preventDefault();
    const search = document.getElementById("mobileSearch").value

    const params = new URLSearchParams();
    const formElements = formmobile.querySelectorAll("input, select");
    console.log(formElements)
    formElements.forEach(el => {
      if (!el.name) return;

      if (el.type === "radio" && el.checked) {
        params.append(el.name, el.value, search);
      } else if (el.type !== "radio" && el.value.trim() !== "") {
        params.append(el.name, el.value, search);
      }

    });

    const query = params.toString();
    const targetUrl = "ricerca.html?" + query;
    console.log(query)

    console.log("Redirecting to: " + targetUrl);
    window.location.href = targetUrl
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const search = document.getElementById("searchfield").value

    const params = new URLSearchParams();
    const formElements = form.querySelectorAll("input, select");
    console.log(formElements)
    formElements.forEach(el => {
      if (!el.name) return;

      if (el.type === "radio" && el.checked) {
        params.append(el.name, el.value, search);
      } else if (el.type !== "radio" && el.value.trim() !== "") {
        params.append(el.name, el.value, search);
      }

    });

    const query = params.toString();
    const targetUrl = "ricerca.html?" + query;
    console.log(query)

    console.log("Redirecting to: " + targetUrl);
    window.location.href = targetUrl
  });
}

function logged() {

  document.getElementById("singform").addEventListener("submit", (event)=>{

  event.preventDefault()

  let email = document.getElementById("emailfield").value;
  let password = document.getElementById("passwordfield").value;
  let ruolo = localStorage.getItem("ruolo")

  fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, pwd: password, role: ruolo })
  })
    .then(response => response.json())
    .then(Data => {

      if (Data.token == null) {

        alert("Credenziali non valide, riprova");
        return;

      } else {

        localStorage.setItem("modalità", ruolo)
        localStorage.setItem("token", Data.token)

      }

      if (ruolo == "C") {

        window.location.href = "index.html"
        return

      } else if (ruolo == "A") {
        window.location.href = "ManageProduct.html"
        return;
      }


    })
    .catch(error => {
      console.error('Error:', error);
      alert("Si è verificato un errore durante il login");
    })
})
}

function reg() {
  document.getElementById('linkreg').addEventListener('click', function () {

    const btnradio1 = document.getElementById("btnradio1");
    console.log(btnradio1)

    let testo, button;

    if (btnradio1.checked) {

      testo = "Welcome to our site</br>Register yourself as Client here";

    } else {

      testo = "Welcome to our site</br>Register yourself as Artisan here";

    }

    localStorage.setItem("registrationMsg", testo);


  })
}

function loggin(){
  document.getElementById("singform").addEventListener("submit", (event)=>{

  event.preventDefault()

  let email = document.getElementById("emailfield").value;
  let password = document.getElementById("passwordfield").value;
  let ruolo = localStorage.getItem("ruolo")

  fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, pwd: password, role: ruolo })
  })
    .then(response => response.json())
    .then(Data => {

      if (Data.token == null) {

        alert("Credenziali non valide, riprova");
        return;

      } else {

        localStorage.setItem("modalità", ruolo)
        localStorage.setItem("token", Data.token)

      }

      if (ruolo == "C") {

        window.location.href= "index.html"
        return

      } else if (ruolo == "A") {
        window.location.href = "ManageProduct.html"
        return;
      }


    })
    .catch(error => {
      console.error('Error:', error);
      alert("Si è verificato un errore durante il login");
    })
})
}

function updateNavbarLogoLink() {
  const role = localStorage.getItem("modalità"); 
  const titleElement = document.querySelector(".navbar-brand");

  if (!titleElement) return; 

  if (role === "A") {
    // artigiano
    titleElement.setAttribute("href", "ManageProduct.html");

  } else if (role === "C") {
    // cliente
    titleElement.setAttribute("href", "index.html");
  } else {
    // se non loggato o ruolo sconosciuto
    titleElement.setAttribute("href", "index.html");
  }
}

function iniImg(){
const token = localStorage.getItem("token")

if(token!="" && token != null){
imgElement = document.getElementById("decorationImage1")  
fetch(`http://localhost:8000/user`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {

      console.log(data)
     
      console.log(imgElement)
      if(data.user.image_url){
      imgElement.src = data.user.image_url
      }

    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
  }
}
 

//funzione per il login

