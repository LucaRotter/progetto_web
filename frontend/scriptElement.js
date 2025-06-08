document.addEventListener('DOMContentLoaded',() => {

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
          

        updateNavbarLogoLink();
        setupSearchForm()
        innerNumCarts()
        reg()
        togglePage()

 
      })
      .catch(err => {
        console.error("Errore nel caricamento della navbar:", err);
      });   

      setTimeout(()=>{
        
        const mod = localStorage.getItem("modalità")
        const token = localStorage.getItem("token")

        let artisan = document.querySelectorAll('.loggedArtisan')
        let notlogged = document.querySelectorAll('.notLogged')
        let logged = document.querySelectorAll('.loggedUser')


        console.log(artisan)
        console.log(notlogged)
        console.log(logged)
        
        if(mod == "C" && token != null){
        console.log("eseguo")
        notlogged.forEach(el => el.classList.add("d-none"))
        artisan.forEach(el => el.classList.add("d-none"))
        logged.forEach(el => el.classList.remove("d-none"))
       

        }else if(mod == "A" && token != null){
        
        notlogged.forEach(el => el.classList.add("d-none"))
        logged.forEach(el => el.classList.add("d-none"))
        artisan.forEach(el => el.classList.remove("d-none"))
        

        }else{
    
        artisan.forEach(el => el.classList.add("d-none"))
        logged.forEach(el => el.classList.add("d-none"))
        notlogged.forEach(el => el.classList.remove("d-none"))
        

        }
    
        document.body.classList.remove("js-loading")
         }, 102);
    })

function innerNumCarts(){
let mod = localStorage.getItem("modalità")

if(mod == "C"){
const token= localStorage.getItem('token')
console.log("il mio toke d'accesso" + token)
fetch('http://localhost:8000/cart-count',{

    headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      })
    .then(Response => Response.json())
    .then(Data =>{
      
      numberofItems = Data.count
      badges =  Array.from(document.querySelectorAll(".cart-badged"))


      badges.forEach(badge =>{
      if(numberofItems >0){

        badge.textContent = numberofItems;
        badge.classList.remove('d-none')
    
      }else{

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

  function ShipPage(){
    window.location.href= "shipPage.html"
   }

   function Userpage(){
    window.location.href= "User.html"
   }

   function Cartpage(){
    window.location.href= "cart.html"
   }

   function Orderspage(){
    window.location.href= "Orders.html"
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


    function Items(){
    window.location.href= "index.html"
   }
   

   function view()
   {
    const modal = document.getElementById('modalView');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
    }
   }

   function logout(){
    
    localStorage.setItem("modalità", "");
    localStorage.setItem("token", "");
    localStorage.setItem("loginSuccess", "false");
    
    window.location.href ="index.html"
     
}

function setupSearchForm() {
  const form = document.getElementById("primarysearchform");
  

  if (!form) {
    console.error("Form non trovata!");
    return;
  }
  console.log("Form trovata!", form);

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
      } else if (el.type !== "radio" && el.value.trim() !== ""){
        params.append(el.name, el.value, search);
      }

    });

    const query = params.toString();
    const targetUrl = "ricerca.html?" + query;
      console.log(query)

    console.log("Redirecting to: " + targetUrl);
    window.location.href= targetUrl
  });
}

function reg(){
document.getElementById('linkreg').addEventListener('click',function(){
    
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

  function updateNavbarLogoLink() {
  const role = localStorage.getItem("modalità"); // "C" o "A"
  const titleElement = document.querySelector(".navbar-brand");

  if (!titleElement) return; // se non c’è il logo/titolo

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