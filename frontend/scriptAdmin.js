let Codice;

function nextStep(event, step) {

  event.preventDefault()
  const email = $(emailAdmin).val();
  const pwd = $(pwdAdmin).val();
  const role = "Ad";

  if (email || pwd) {


    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, pwd: pwd, role: role })
    })
      .then(response => response.json())
      .then(Data => {
        Codice = Data.number
        const token = Data.token
        sessionStorage.setItem("tmptoken", token)
      })
      .catch(error => {
        console.log(error)
      })



    $('.step').addClass('d-none');
    $(`#step${step}`).removeClass('d-none');

    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    const tab = document.getElementById(`step${step}-tab`);
    tab.classList.add('active');
    tab.classList.remove('disabled');
    const steps = ['1', '2'];

  } else {

    return;

  }
}

function CodeControl(event) {
  event.preventDefault();

  const number = `${$('#Code1').val()}${$('#Code2').val()}`

  if (number == Codice) {

    tk = sessionStorage.getItem("tmptoken")
    localStorage.setItem("token", tk)
    window.location.href = 'AdminPage.html';

  } else {
    alert("Codice non corretto!")
  }

}


const codeInputs = document.querySelectorAll('.code-box');

codeInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (/^[0-9]$/.test(input.value)) {
      if (input.value.length === input.maxLength) {
        const nextInput = codeInputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    } else {
      input.value = '';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value.length === 0) {
      const prevInput = codeInputs[index - 1];
      if (prevInput) prevInput.focus();
    }
  });
});