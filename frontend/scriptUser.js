const detailsBtn = document.getElementById("details");
const passwordBtn = document.getElementById("password");
const token = localStorage.getItem("token")

document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("nameUser")
  const surname = document.getElementById("surnameUser")
  const email = document.getElementById("emailUser")
  const img = document.getElementById("profilePic")

  fetch(`http://localhost:8000/user`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      name.textContent += data.user.name
      surname.textContent += data.user.surname
      email.textContent += data.user.email

      if (data.user.image_url) {
        img.src = data.user.image_url
      }
    })
    .catch(error => {
      console.error("Si è verificato un errore:", error);
    });
})

detailsBtn.addEventListener("click", function () {
  openModal("modifyModal1", "modalOverlay");
});

function openModal(modalId, overlayId) {
  document.getElementById("modifyModal1").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById(modalId).style.display = "block";
  document.getElementById(overlayId).style.display = "block";

  const inputIds = ["name", "surname"];
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.style.border = "";
    }
  });
}

function closeModal() {
  document.getElementById("modifyModal1").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
}
document.getElementById("modalOverlay").addEventListener("click", closeModal);

function saveChanges(event) {
  event.preventDefault();
  const modal1 = document.getElementById("modifyModal1");
  const name = document.getElementById("name");
  const surname = document.getElementById("surname");
  const passedname = name.value
  const passedsurname = surname.value

  let valid = true;
  name.style.border = "";
  surname.style.border = "";

  const nameValid = /[a-zA-Z]/.test(name.value.trim());
  const surnameValid = /[a-zA-Z]/.test(surname.value.trim());

  if (!nameValid) {
    name.style.border = "2px solid red";
    valid = false;
  }
  if (!surnameValid) {
    surname.style.border = "2px solid red";
    valid = false;
  }
  if (!valid) return;
  name.value = "";
  surname.value = "";

  fetch(`http://localhost:8000/update-name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: passedname, surname: passedsurname })
  })
    .then(response => response.json())
    .then(Data => {
      closeModal();
      window.location.reload();
    })
    .catch(error => {
      console.error("Errore nella modifica del prodotto:", error);
    });
}

function previewImage(event) {
  const input = event.target;
  let imgElement = document.getElementById("profilePic");
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      imgElement.src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);

    // crea file img non passabile tramite json
    const formData = new FormData();
    formData.append('immagine', file);

    fetch('http://localhost:8000/profile-picture', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        imgElement.src = data.imageUrl;
      })
      .catch(error => {
        console.error("Errore durante l'upload:", error);
      });
  }
}
