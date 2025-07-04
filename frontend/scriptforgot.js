const emailForm = document.getElementById('emailForm');
const newPasswordInput = document.getElementById("newPassword");

// Recupera ruolo dal localStorage
const ruolo = localStorage.getItem("ruolo")

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

// -step 1 invio email
if (step === "step1") {
  emailForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const emailInput = document.getElementById('email').value;
    localStorage.setItem("email", emailInput); // salva per step 2

    fetch('http://localhost:8000/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailInput, role: ruolo })
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        console.error("Errore invio email:", error);
      });
  });
}

// step 2 reset pw
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
        localStorage.removeItem("email");
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error("Errore reset password:", error);
      });
  });
}




