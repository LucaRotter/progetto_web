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

  const filters = [
    "books",
    "electronics",
    "clothing",
    "home",
    "garden",
    "tech",
    "sports",
    "beauty",
    "food"
  ];

  filtersContainer.innerHTML = "";

 
  const row = document.createElement("div");
  row.className = "row g-4"; 

  
  const col1 = document.createElement("div");
  col1.className = "col-md-4";

  const catTitle = document.createElement("h5");
  catTitle.textContent = "Categories";
  col1.appendChild(catTitle);

  const catContainer = document.createElement("div");
  catContainer.className = "d-flex flex-wrap gap-2";

  filters.forEach(filter => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn custom-btn w-100";
    btn.dataset.filter = filter;
    btn.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);
    catContainer.appendChild(btn);
  });

  col1.appendChild(catContainer);

  
  const col2 = document.createElement("div");
  col2.className = "col-md-4";

  const priceTitle = document.createElement("h5");
  priceTitle.textContent = "Price";
  col2.appendChild(priceTitle);

  const minPriceGroup = document.createElement("div");
  minPriceGroup.className = "mb-3";
  minPriceGroup.innerHTML = `
    <label for="minPrice" class="form-label">Min Price</label>
    <input type="number" class="form-control" id="minPrice" placeholder="€ Min" min="0" step="0.01">
  `;

  const maxPriceGroup = document.createElement("div");
  maxPriceGroup.className = "mb-3";
  maxPriceGroup.innerHTML = `
    <label for="maxPrice" class="form-label">Max Price</label>
    <input type="number" class="form-control" id="maxPrice" placeholder="€ Max" min="0" step="0.01">
  `;

  col2.appendChild(minPriceGroup);
  col2.appendChild(maxPriceGroup);

 
  const col3 = document.createElement("div");
  col3.className = "col-md-4";

  const ratingTitle = document.createElement("h5");
  ratingTitle.textContent = "Min Rating";
  col3.appendChild(ratingTitle);

  const ratingSelect = document.createElement("select");
  ratingSelect.className = "form-select";
  ratingSelect.id = "minRating";
  ratingSelect.innerHTML = `
    <option value="">Select Rating</option>
    <option value="1">⭐ 1 </option>
    <option value="2">⭐⭐ 2 </option>
    <option value="3">⭐⭐⭐ 3 </option>
    <option value="4">⭐⭐⭐⭐ 4 </option>
    <option value="5">⭐⭐⭐⭐⭐ 5</option>
    
  `;

  col3.appendChild(ratingSelect);

  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);

  filtersContainer.appendChild(row);
}
