const description = document.getElementById("description");
const selectType = document.getElementById("type");
// Apre la finestra del report
function openModal() {
  document.getElementById("reportModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
}


// Chiude la finestra del report
function closeModal() {
  document.getElementById("reportModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  

  description.value = "";
  description.style.border = "";
  selectType.selectedIndex = 0;
}


// Manda il report se la descrizione è stata scritta 
function sendReport() {
    const description = document.getElementById("description");

    let valid = true;
    description.style.border = "";

    if (!description.value.trim()) {
      description.style.border = "2px solid red";
      valid = false;
    }
    if (!valid) {
      return; 
    }
    description.value = "";
    selectType.selectedIndex = 0;
    closeModal();
  }



// Crea per ogni reportTypes un'option che verra aggiunta alla select
document.addEventListener("DOMContentLoaded", () => {
  const reportTypes = [
  "Data breach",
  "Phishing attempt",
  "Malware or viruses",
  "Suspicious login activity",
  "Unauthorized data collection",
  "Insecure payment methods",
  "Inappropriate or offensive content",
  "Nudity or sexual content",
  "Hate speech or violence",
  "False or misleading information",
  "Plagiarized content",
  "Outdated or irrelevant content",
  "Fake or counterfeit products",
  "Product not as described",
  "Price manipulation or scam",
  "Item unavailable",
  "Incorrect specifications",
  "Missing shipping/payment info",
  "Harassment or abuse",
  "Spamming or flooding",
  "Fraudulent reviews",
  "Impersonation or fake accounts",
  "Broken links or pages",
  "Slow loading or crashing",
  "Unusable on mobile/tablet",
  "Feature not working",
  "Copyright violation",
  "Trademark infringement",
  "Violation of terms of service",
  "GDPR or privacy law violation",
  "Poor customer service",
  "Language or translation errors",
  "General complaint",
  "Other (please specify)"
  ];

  const selectType = document.getElementById("type");
  selectType.innerHTML = ""; 

  reportTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type.toLowerCase().replace(/\s+/g, '-');
    option.textContent = type;
    selectType.appendChild(option);
  });
});