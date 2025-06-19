const token = localStorage.getItem('token');
localStorage.setItem("Admin", "true")
let selectedReport

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Devi effettuare il login!');
    window.location.href = 'login.html';
    return;
  }

  fetch(`http://localhost:8000/free-reports`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      elemento = data.reports
      creationReport(elemento)

    }).catch(error => {
      console.error("Si è verificato un errore:", error);

    });

  fetch('http://localhost:8000/admin-reports', {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      createMyReports(data.reports);
    })
    .catch(error => {
      console.error("Errore nei miei report:", error);
    });

})

fetch('http://localhost:8000/users', {
  headers: {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    renderUsers(data.users);
  })
  .catch(error => {
    console.error("Errore nei miei report:", error);
  });

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function deleteReport(id) {

  if (!confirm(`Sei sicuro di voler eliminare la segnalazione #${id}?`)) {
    return;
  }

  fetch(`http://localhost:8000/delete-report/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Errore nella cancellazione del report");
      }
      return response.json();
    })
    .then(data => {
      // Rimuovi da entrambi i container se esiste
      const reportEl = document.getElementById(id);
      if (reportEl) reportEl.remove();

      alert(`Report #${id} eliminato con successo`);
    })
    .catch(error => {
      console.error("Errore durante l'eliminazione:", error);
      alert("Errore durante l'eliminazione del report");
    });
}

function addAdminGlobal() {
  alert("Aggiunta admin globale!");
}

function takeCharge(id) {

  selectedReport = id
  fetch(`http://localhost:8000/add-admin-report/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const reportEl = document.getElementById(id);
      if (reportEl) reportEl.remove();

      fetch(`http://localhost:8000/admin-reports`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const container = document.getElementById('my-reports-container');
          container.innerHTML = "";
          createMyReports(data.reports)
          alert(`Hai preso in carico il report #${selectedReport}`);
        })
        .catch(error => {
          console.error("Si è verificato un errore:", error);
        })

    })
    .catch(error => {
      console.error("Errore nel prendere in carico il report:", error);
      alert("Non è stato possibile prendere in carico il report.");
    });
}



function creationReport(reports) {
  const container = document.getElementById('reports-container');
  reports.forEach(report => {
    const div = document.createElement('div');
    div.classList.add('report');
    div.id = report.report_id

    const header = document.createElement('div');
    header.classList.add('report-header');
    header.textContent = `report: ${report.category}`;

    const body = document.createElement('div');
    body.classList.add('report-body', 'mb-2');
    body.textContent = report.description;

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('d-flex', 'flex-wrap', 'gap-1', 'justify-content-end', 'button-group-responsive');

    const takeChargeBtn = document.createElement('button');
    takeChargeBtn.classList.add('btn', 'btn-sm', 'btn-outline-success');
    takeChargeBtn.innerHTML = `<i class="bi bi-check-circle"></i> Take Charge`;
    takeChargeBtn.addEventListener('click', () => takeCharge(report.report_id));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    deleteBtn.innerHTML = `<i class="bi bi-trash"></i> Delete`;
    deleteBtn.addEventListener('click', () => deleteReport(report.report_id));

    buttonGroup.appendChild(takeChargeBtn);
    buttonGroup.appendChild(deleteBtn);

    div.appendChild(header);
    div.appendChild(body);
    div.appendChild(buttonGroup);

    container.appendChild(div);
  });
}

function logout() {

  localStorage.setItem("modalità", "");
  localStorage.setItem("token", "");
  localStorage.setItem("Admin", "")
  window.location.href = "index.html"
}



function createMyReports(reports) {

  const myReportsContainer = document.getElementById('my-reports-container');

  reports.forEach(report => {

    const div = document.createElement('div');
    div.classList.add('report');
    div.id = report.report_id;

    const header = document.createElement('div');
    header.classList.add('report-header');
    header.textContent = `report: ${report.report_id}`;

    const body = document.createElement('div');
    body.classList.add('report-body', 'mb-2');
    body.textContent = report.category;

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('d-flex', 'flex-wrap', 'gap-1', 'justify-content-end', 'button-group-responsive');

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    removeBtn.innerHTML = `<i class="bi bi-trash"></i> Remove`;
    removeBtn.addEventListener('click', () => deleteReport(report.report_id));

    buttonGroup.appendChild(removeBtn);
    div.appendChild(header);
    div.appendChild(body);
    div.appendChild(buttonGroup);

    myReportsContainer.appendChild(div);

  })


}

function modifyUser(nome) {
  alert(`Modifica utente: ${nome}`);
}

function deleteUser(nome) {
  if (confirm(`Sei sicuro di voler eliminare ${nome}?`)) {
    alert(`${nome} eliminato`);
  }
}

function renderUsers(users) {
  const container = document.querySelector('.list-group');
  container.innerHTML = ''; // Pulisce contenitore

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('list-group-item');
    userDiv.id = user.id; // ID unico per il div utente

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('d-flex', 'flex-column', 'flex-sm-row', 'justify-content-between', 'align-items-start', 'align-items-sm-center', 'gap-2');

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info', 'text-break');
    userInfo.innerHTML = `<strong>${user.name}</strong> - ${user.email}`;

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('d-flex', 'flex-wrap', 'gap-1', 'justify-content-end', 'button-group-responsive');

    const modifyBtn = document.createElement('button');
    modifyBtn.classList.add('btn', 'btn-sm', 'btn-outline-warning');
    modifyBtn.innerHTML = `<i class="bi bi-pencil"></i> Modify`;
    modifyBtn.addEventListener('click', () => modifyUser(user));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger');
    deleteBtn.innerHTML = `<i class="bi bi-trash"></i> Delete`;
    deleteBtn.addEventListener('click', () => deleteUser(user));

    buttonGroup.appendChild(modifyBtn);
    buttonGroup.appendChild(deleteBtn);

    flexContainer.appendChild(userInfo);
    flexContainer.appendChild(buttonGroup);
    userDiv.appendChild(flexContainer);
    container.appendChild(userDiv);
  });
}

function deleteUser(user) {
  if (!confirm(`Sei sicuro di voler eliminare ${user.name}?`)) return;

  fetch(`http://localhost:8000/user/${user.user_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const div = document.getElementById(user.id);
      if (div) div.remove();
      alert(`Utente ${user.name} eliminato con successo`);
    })
    .catch(error => {
      console.error("Errore:", error);
      alert("Errore durante l'eliminazione dell'utente");
    });
}

function modifyUser(user) {
  document.getElementById('userId').value = user.user_id;
  document.getElementById('userName').value = user.name;
  document.getElementById('userSurname').value = user.surname;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userPassword').value = "";

  // Salvo i valori originali nel dataset del form
  const form = document.getElementById("editUserForm");
  form.dataset.originalName = user.name;
  form.dataset.originalSurname = user.surname;
  form.dataset.originalEmail = user.email;
  form.dataset.originalPassword = ""; // Di default vuoto, perché la password non viene mostrata

  const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
  modal.show();
}

// Funzione per attivare/disattivare campi
function toggleField(fieldId, button) {
  const input = document.getElementById(fieldId);
  if (input.disabled) {
    input.disabled = false;
    input.focus();
    button.innerText = "💾";
  } else {
    input.disabled = true;
    button.innerText = "✏";
  }
}


document.getElementById("editUserForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("userId").value;

  const updatedUser = {
    name: document.getElementById("userName").value,
    surname: document.getElementById("userSurname").value,
    email: document.getElementById("userEmail").value,
    password: document.getElementById("userPassword").value,
  };

  const form = document.getElementById("editUserForm");
  const originalUser = {
    name: form.dataset.originalName,
    surname: form.dataset.originalSurname,
    email: form.dataset.originalEmail,
    password: form.dataset.originalPassword,
  };

  function updateName() {
    if (updatedUser.name !== originalUser.name || updatedUser.surname !== originalUser.surname) {
      return fetch(`http://localhost:8000/update-name-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: updatedUser.name, surname: updatedUser.surname }),
      })
        .then((res) => res.json())
        .then((data) => {
        });
    }
    return Promise.resolve();
  }

  function updateEmail() {
    if (updatedUser.email !== originalUser.email) {
      return fetch(`http://localhost:8000/update-email/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail: updatedUser.email }),
      })
        .then((res) => res.json())
        .then((data) => {
        });
    }
    return Promise.resolve();
  }

  function updatePassword() {
    if (updatedUser.password !== originalUser.password && updatedUser.password !== "") {
      return fetch(`http://localhost:8000/update-password/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: updatedUser.password }),
      })
        .then((res) => res.json())
        .then((data) => {
        });
    }
    return Promise.resolve();
  }

  updateName()
    .then(() => updateEmail())
    .then(() => updatePassword())
    .then(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById("editUserModal"));
      modal.hide();
      alert("Utente aggiornato correttamente.");
    })
    .catch((error) => {
      console.error("Errore durante l'aggiornamento:", error);
      alert("Errore durante l'aggiornamento dell'utente.");
    });
});

