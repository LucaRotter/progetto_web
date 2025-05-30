 const detailsBtn = document.getElementById("details");
const passwordBtn = document.getElementById("password");

  detailsBtn.addEventListener("click", function () {
    openModal("modifyModal1", "modalOverlay");
  });
  passwordBtn.addEventListener("click", function () {
    openModal("modifyModal2", "modalOverlay2");
  });

  function openModal(modalId, overlayId) {
    document.getElementById("modifyModal1").style.display = "none";
    document.getElementById("modifyModal2").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("modalOverlay2").style.display = "none";

    document.getElementById(modalId).style.display = "block";
    document.getElementById(overlayId).style.display = "block";

      const inputIds = ["name", "surname", "oldpw", "newpw"];
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.style.border = "";
    }
  });
}

  function closeModal() {
    document.getElementById("modifyModal1").style.display = "none";
    document.getElementById("modifyModal2").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("modalOverlay2").style.display = "none";
  }

  document.getElementById("modalOverlay").addEventListener("click", closeModal);
  document.getElementById("modalOverlay2").addEventListener("click", closeModal);



function saveChanges(event) {
  event.preventDefault();

  const modal1 = document.getElementById("modifyModal1");
  const modal2 = document.getElementById("modifyModal2");

  if (modal1.style.display === "block") {
    const name = document.getElementById("name");
    const surname = document.getElementById("surname");

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
    closeModal();
  }

  else if (modal2.style.display === "block") {
    const oldPw = document.getElementById("oldpw");
    const newPw = document.getElementById("newpw");

    let valid = true;
    oldPw.style.border = "";
    newPw.style.border = "";

    if (oldPw.value !== "bisognaControllarlaConDB") {
      oldPw.style.border = "2px solid red";
      valid = false;
    }

    if (newPw.value.length < 8) {
      newPw.style.border = "2px solid red";
      valid = false;
    }

    if (!valid) return;

    oldPw.value = "";
    newPw.value = "";
    closeModal();
  }
}

