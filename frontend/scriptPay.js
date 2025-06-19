items = localStorage.getItem("cart")

function nextStep(step) {
  const currentStep = document.getElementById(`step${step - 1}`);
  const token = localStorage.getItem("token");

  // Validazione
  if (validateStep(step - 1)) {
    if (step === 2) {

      fetch('http://localhost:8000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: items
      })
        .then(response => response.json())
        .then(Data => {
          window.location.href = Data.url;
        })
        .catch(error => {
          console.log(error)
        })

    } else {
      document.getElementById('DataInserment').classList.add('d.none');
      document.getElementById(`step${step}`).classList.remove('d-none');
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
      const tab = document.getElementById(`step${step}-tab`);
      if (tab) {
        tab.classList.add('active');
        tab.classList.remove('disabled');
      }

      const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
      breadcrumbItems.forEach((item, index) => {
        item.classList.remove('active', 'disabled');
        if (index === step - 1) {
          item.classList.add('active');
        } else if (index < step - 1) {
          item.classList.remove('disabled');
        } else {
          item.classList.add('disabled');
        }
      });
    }
  } else { }
}

function validateStep(step1) {
  let isValid = true;
  let numero
  const currentStep = document.getElementById(`step${step1}`);

  const inputs = currentStep.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    if (!input.checkValidity()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {

      // Validazione personalizzata per civico
      if (input.name === "civico") {
        const civicoRegex = /^[A-Za-z]?\d+[A-Za-z]?$/;
        if (!civicoRegex.test(input.value)) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      }

      if (input.name === "cap") {
        const countryName = document.getElementById('stato').value;
        const countryCode = countryNameToCode(countryName);
        const capValue = input.value.trim();

        if (!countryCode) {
          input.classList.remove('is-invalid');
        } else {
          if (!validatePostalCode(capValue, countryCode)) {
            input.classList.add('is-invalid');
            isValid = false;
          } else {
            input.classList.remove('is-invalid');
          }
        }
      }

      const prefissoSelect = document.getElementById("prefisso");
      const telefonoInput = document.getElementById("telefono");
      const prefisso = prefissoSelect.value;
      const telefono = telefonoInput.value.trim();

      // reset classi
      prefissoSelect.classList.remove("is-invalid");
      telefonoInput.classList.remove("is-invalid");

      numero = `${prefisso}${telefono}`
      let isValid = true;

      // controllo prefisso selezionato
      if (!prefisso) {
        prefissoSelect.classList.add("is-invalid");
        isValid = false;
      }

      // controllo solo cifre nel telefono
      if (!/^\d+$/.test(telefono)) {
        telefonoInput.classList.add("is-invalid");
        isValid = false;
      } else if (prefisso && phoneLengths[prefisso]) {

        // controllo lunghezza numero
        const { min, max } = phoneLengths[prefisso];
        if (telefono.length < min || telefono.length > max) {
          telefonoInput.classList.add("is-invalid");
          isValid = false;
        }
      }
    }
    let address = document.getElementById("via").value
    let civic_number = document.getElementById("civico").value
    let cap = document.getElementById("cap").value
    let province = document.getElementById("provincia").value
    let state = document.getElementById("stato").value

    localStorage.setItem("infoClient", JSON.stringify({ items, address: address, civic_number: civic_number, postal_code: cap, province: province, country: state, phone_number: numero }))

  });
  return isValid;
}

const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  if (!validateTelefono()) {
    e.preventDefault();
    e.stopPropagation();
  }
});

// costante per lo stato
const countries = [
  "Italia", "Francia", "Germania", "Stati Uniti", "Canada", "Regno Unito",
  "Australia", "India", "Giappone", "Brasile", "Argentina", "Cina", "Messico",
  "Spagna", "Paesi Bassi", "Svezia", "Sud Africa", "Nuova Zelanda", "Singapore",
  "Russia", "Emirati Arabi Uniti", "Irlanda"
];

const select = document.getElementById("stato");
select.innerHTML = '<option value="" selected disabled>Seleziona uno stato</option>';
countries.forEach(country => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  select.appendChild(option);
});

// costante per prefisso telefonico
const phonePrefixes = [
  { code: "+39", country: "Italia" },
  { code: "+33", country: "Francia" },
  { code: "+49", country: "Germania" },
  { code: "+1", country: "Stati Uniti" },
  { code: "+1", country: "Canada" },
  { code: "+44", country: "Regno Unito" },
  { code: "+61", country: "Australia" },
  { code: "+91", country: "India" },
  { code: "+81", country: "Giappone" },
  { code: "+55", country: "Brasile" },
  { code: "+54", country: "Argentina" },
  { code: "+86", country: "Cina" },
  { code: "+52", country: "Messico" },
  { code: "+34", country: "Spagna" },
  { code: "+31", country: "Paesi Bassi" },
  { code: "+46", country: "Svezia" },
  { code: "+27", country: "Sud Africa" },
  { code: "+64", country: "Nuova Zelanda" },
  { code: "+65", country: "Singapore" },
  { code: "+7", country: "Russia" },
  { code: "+971", country: "Emirati Arabi Uniti" },
  { code: "+353", country: "Irlanda" }
];
const prefissoSelect = document.getElementById("prefisso");
prefissoSelect.innerHTML = '<option value="" selected disabled>Seleziona</option>';
phonePrefixes.forEach(({ code, country }) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = `${code} (${country})`;
  prefissoSelect.appendChild(option);
});


const phoneLengths = {
  "+39": { min: 8, max: 10 },   // Italia: generalmente 8-10 cifre
  "+33": { min: 9, max: 9 },    // Francia: 9 cifre fisse
  "+49": { min: 7, max: 12 },   // Germania: varia molto, da 7 a 12 cifre
  "+1": { min: 10, max: 10 },   // Stati Uniti e Canada: 10 cifre fisse (area + numero)
  "+44": { min: 10, max: 10 },  // Regno Unito: generalmente 10 cifre
  "+61": { min: 9, max: 9 },    // Australia: 9 cifre fisse
  "+91": { min: 10, max: 10 },  // India: 10 cifre fisse
  "+81": { min: 10, max: 10 },  // Giappone: 10 cifre (varia poco)
  "+55": { min: 10, max: 11 },  // Brasile: 10 o 11 cifre (con prefissi locali)
  "+54": { min: 10, max: 11 },  // Argentina: 10 o 11 cifre
  "+86": { min: 11, max: 11 },  // Cina: 11 cifre fisse
  "+52": { min: 10, max: 10 },  // Messico: 10 cifre
  "+34": { min: 9, max: 9 },    // Spagna: 9 cifre fisse
  "+31": { min: 9, max: 9 },    // Paesi Bassi: 9 cifre
  "+46": { min: 9, max: 9 },    // Svezia: 9 cifre
  "+27": { min: 9, max: 9 },    // Sud Africa: 9 cifre
  "+64": { min: 8, max: 8 },    // Nuova Zelanda: 8 cifre
  "+65": { min: 8, max: 8 },    // Singapore: 8 cifre
  "+7": { min: 10, max: 10 },  // Russia: 10 cifre (escluso prefisso)
  "+971": { min: 9, max: 9 },    // Emirati Arabi Uniti: 9 cifre
  "+353": { min: 7, max: 9 }     // Irlanda: 7-9 cifre variabili
};
document.getElementById("telefono").addEventListener("input", () => {
  validateStep(1);
});
document.getElementById("prefisso").addEventListener("change", () => {
  validateStep(1);
});

// mappa gli stati per il controllo posta code
const countryNameToCodeMap = {
  "Italia": "IT",
  "Francia": "FR",
  "Germania": "DE",
  "Stati Uniti": "US",
  "Canada": "CA",
  "Regno Unito": "UK",
  "Australia": "AU",
  "India": "IN",
  "Giappone": "JP",
  "Brasile": "BR",
  "Argentina": "AR",
  "Cina": "CN",
  "Messico": "MX",
  "Spagna": "ES",
  "Paesi Bassi": "NL",
  "Svezia": "SE",
  "Sud Africa": "ZA",
  "Nuova Zelanda": "NZ",
  "Singapore": "SG",
  "Russia": "RU",
  "Emirati": "AE",
  "Irlanda": "IE"

};

function countryNameToCode(name) {
  return countryNameToCodeMap[name] || null;
}

// costante per inserimendo cap in base alla nazione
const postalCodeFormats = {
  IT: /^\d{5}$/,                                // Italia
  FR: /^\d{5}$/,                                // Francia
  DE: /^\d{5}$/,                                // Germania
  US: /^\d{5}(-\d{4})?$/,                       // Stati Uniti (ZIP o ZIP+4)
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,  // Canada
  UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,    // Regno Unito
  AU: /^\d{4}$/,                                // Australia
  IN: /^\d{6}$/,                                // India
  JP: /^\d{3}-\d{4}$/,                          // Giappone
  BR: /^\d{5}-?\d{3}$/,                         // Brasile
  AR: /^\d{4}$/,                                // Argentina
  CN: /^\d{6}$/,                                // Cina
  MX: /^\d{5}$/,                                // Messico
  ES: /^\d{5}$/,                                // Spagna
  NL: /^\d{4}\s?[A-Z]{2}$/,                     // Paesi Bassi
  SE: /^\d{3}\s?\d{2}$/,                        // Svezia
  ZA: /^\d{4}$/,                                // Sud Africa
  NZ: /^\d{4}$/,                                // Nuova Zelanda
  SG: /^\d{6}$/,                                // Singapore
  RU: /^\d{6}$/,                                // Russia
  AE: /^$/,                                     // Emirati (nessun CAP ufficiale)
  IE: /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}$/,      // Irlanda (Eircode semplificato)
};

function countryNameToCode(name) {
  return countryNameToCodeMap[name] || null;
}

function validatePostalCode(capValue, countryCode) {
  const regex = postalCodeFormats[countryCode];
  // Se non definito, accetta tutto
  if (!regex) return true;
  return regex.test(capValue.trim());
}


const statoSelect = document.getElementById("stato");
statoSelect.innerHTML = '<option value="" selected disabled>Seleziona uno stato</option>';

countries.forEach(country => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  statoSelect.appendChild(option);
});

statoSelect.addEventListener("change", () => {
  const selectedCountry = statoSelect.value;
  const countryCode = countryNameToCode(selectedCountry);
  const capInput = document.getElementById("cap");
  const capValue = capInput.value.trim();

  if (capValue.length === 0) {
    capInput.classList.remove("is-invalid");
    return;
  }

  if (!countryCode) {
    capInput.classList.remove("is-invalid");
    return;
  }

  if (!validatePostalCode(capValue, countryCode)) {
    capInput.classList.add("is-invalid");
  } else {
    capInput.classList.remove("is-invalid");
  }
});

const capInput = document.getElementById("cap");
capInput.addEventListener("input", () => {
  const selectedCountry = statoSelect.value;
  const countryCode = countryNameToCode(selectedCountry);
  const capValue = capInput.value.trim();

  if (capValue.length === 0 || !countryCode) {
    capInput.classList.remove("is-invalid");
    return;
  }

  if (!validatePostalCode(capValue, countryCode)) {
    capInput.classList.add("is-invalid");
  } else {
    capInput.classList.remove("is-invalid");
  }
});

const [totalPrice, itemCount] = JSON.parse(sessionStorage.getItem("recapP"))
document.getElementById("itemNumber").textContent = "total " + itemCount
document.getElementById("totalPrice").textContent = "total product " + totalPrice 
