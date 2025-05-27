document.addEventListener('DOMContentLoaded',() => {

       fetch('navbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById("header").innerHTML = html;
        initFilters()
        initSearchAutocomplete()
      })
      .catch(err => {
        console.error("Errore nel caricamento della navbar:", err);
      });   

      setTimeout(()=>{
        
        const mod = sessionStorage.getItem("modalità")
        const token = sessionStorage.getItem("token")

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
    

   function Userpage(){
    window.location.href= "User.html"
   }

   function Cartpage(){
    window.location.href= "cart.html"
   }

   function Orderspage(){
    window.location.href= "Orders.html"
   }

   function Managepage(){
    window.location.href= "ManageProduct.html"
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
    
    sessionStorage.setItem("modalità", "");
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("loginSuccess", "false");
    window.location.href ="index.html"
     
}
  
function initFilters() {
  const filtersContainer = document.getElementById("filtersContainer");

  if (!filtersContainer) {
    console.error("filtersContainer non trovato");
    return;
  }

  const filters  = [
  "books",
  "elettronics",
  "clothing",
  "home",
  "garden",
  "teck",
  "sports",
  "beauty",
  "food"
];

  filters.forEach((filter, i) => {
    const id = `filter${i + 1}`;
    const div = document.createElement("div");
    div.className = "form-check";

   div.innerHTML = `
  <div class="list-group">
    <button type="button" class="list-group-item list-group-item-action filter-button" data-filter="${filter}">
      ${filter}
    </button>
  </div>
`;

    filtersContainer.appendChild(div);
  });
}

suggestionsList.appendChild(suggestionsList);


 function fetchSuggestions(query) {
  const searchField = document.getElementById("searchfield");
  const suggestionsList = document.getElementById("suggestionsList");

  if (query.length < 2) {
    suggestionsList.style.display = "none";
    suggestionsList.innerHTML = '';
    return;
  }
  

  // Costruisce la URL con parametro name
  const url = `/items?name=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      suggestionsList.innerHTML = '';
      if (data.length > 0) {
        data.forEach(item => {
          const li = document.createElement("li");
          li.className = "list-group-item list-group-item-action";
          li.textContent = item.name; // Assicurati che nel DB il campo sia `name`
          li.addEventListener("click", () => {
            searchField.value = item.name;
            suggestionsList.style.display = "none";
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = "block";
      } else {
        suggestionsList.style.display = "none";
      }
    })
    .catch(err => {
      console.error("Error in the fetch elemets:", err);
      suggestionsList.style.display = "none";
    });
    }
