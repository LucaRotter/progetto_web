import { checkAuthOrRedirect } from './auth.js';

checkAuthOrRedirect();

$('#formReg').on("submit", function(event) {

    event.preventDefault();

    let name = $("#namefield").val();
    let surname = $("#surnamefield").val();
    let email = $("#emailfieldr").val();
    let pwd = $("#pwdfield").val();
    let confpwd =$("#confirmpwdfield").val();
    let Role = localStorage.getItem("ruolo")

    console.log(name,surname,email,pwd,confpwd,Role)

    if(pwd==confpwd){

    fetch('http://localhost:8000/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ name: name, surname: surname, email: email, pwd:pwd, role: Role})

    })
    .then(response=> response.json())
    .then(Data =>{
       console.log("sono dentro")
       console.log(Data)
       
       localStorage.setItem("modalità", Role)
       localStorage.setItem("loginSuccess", "true")
    })
    .catch(error=>{
        console.log("error 404" + error)
    })
    window.location.href ="index.html";
   
}

})

$(document).ready(function() {
    const msg = localStorage.getItem("registrationMsg");
    console.log(msg)
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