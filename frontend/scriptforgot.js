const emailForm = document.getElementById('emailForm');
const newPasswordInput = document.getElementById("newPassword");

// Recupera ruolo dal localStorage
const ruolo = localStorage.getItem("ruolo") 
console.log(ruolo)

// Rileva step attuale basandosi su .reset
let stepElement = document.getElementsByClassName("reset")[0];
let step = stepElement ? stepElement.id : "step1";
const prevstep = "step1";

// Recupera email da localStorage o dall'URL
let email = localStorage.getItem("email");
const urlParams = new URLSearchParams(window.location.search);
const emailFromUrl = urlParams.get("email");

if (emailFromUrl) {
  email = emailFromUrl;
  localStorage.setItem("email", emailFromUrl); // Salva per step2
}

console.log("Step:", step);
console.log("Email attuale:", email);

// --- STEP 1: INVIO EMAIL RESET ---
if (step === "step1") {
  emailForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value;
    localStorage.setItem("email", emailInput); // salva per step 2
    console.log(localStorage.getItem("ruolo"))
    fetch('http://localhost:8000/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailInput, role: ruolo })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Dati ricevuti (email inviata):", data);
        // L'utente riceverà il link via email
      })
      .catch(error => {
        console.error("Errore invio email:", error);
      });
  });
}

// --- STEP 2: RESET PASSWORD ---
if (step === "step2") {
  document.getElementById("formReset").addEventListener("submit", function (event) {
    event.preventDefault();

   const newPassword = newPasswordInput.value;
   const urlParams = new URLSearchParams(window.location.search);
   const emailFromUrl = urlParams.get("email");
   const ruoloFromUrl = urlParams.get("role");


    fetch('http://localhost:8000/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailFromUrl, newPassword: newPassword, role: ruoloFromUrl })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Password aggiornata con successo:", data);
        // Pulizia dati se vuoi
        localStorage.removeItem("email");
        // Redirect
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error("Errore reset password:", error);
      });
  });
}
    



    