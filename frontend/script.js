
$('#formReg').on("submit", function (event) {

    event.preventDefault();

    let name = $("#namefield").val();
    let surname = $("#surnamefield").val();
    let email = $("#emailfieldr").val();
    let pwd = $("#pwdfield").val();
    let confpwd = $("#confirmpwdfield").val();
    let Role = localStorage.getItem("ruolo")

    if (pwd == confpwd && name && surname && email && pwd && confpwd) {

        fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ name: name, surname: surname, email: email, pwd: pwd, role: Role })

        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error("Utente già registrato.");
                    } else {
                        throw new Error("Errore generico: " + response.status);
                    }
                }
                return response.json();
            })
            .then(Data => {
                console.log("sono dentro");
                console.log(Data);

                localStorage.setItem("modalità", Role);
                localStorage.setItem("loginSuccess", "true");
                localStorage.setItem("token", Data.token);

                if (Role == "C") {
                    window.location.href = "index.html";

                } else if (Role == "A") {

                    window.location.href = "ManageProduct.html"
                }
            })
            .catch(error => {
                console.error("Errore:", error.message);
                alert(error.message);
            });

    }

})

$(document).ready(function () {
    const msg = localStorage.getItem("registrationMsg");

    if (msg) {

        $("#Welcomep").html(msg);
    }
});

//funzione prendere il valore del campo di ricerca e mostrare il risultato 
$("#primarysearchform").on("submit", function (event) {
    event.preventDefault();
    const searchQuery = $("#searchfield").val();
    this.reset();
})