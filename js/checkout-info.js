document.addEventListener('DOMContentLoaded', function() {
 // Variabile pentru elementele din această pagină
 const step1 = document.getElementById('step-1');
 const toStep2Button = document.getElementById('to-step-2');
 const backToShopLink = document.querySelector('.back-link');

 // Funcții de validare specifice acestei pagini
 function validateStep1() {
     const requiredFields = step1.querySelectorAll('input[required], select[required]');
     let isValid = true;

     requiredFields.forEach(function(field) {
         if (!field.value.trim()) {
             isValid = false;
             showError(field, 'Acest câmp este obligatoriu');
         } else {
             clearError(field);
         }
     });

     // Validare email
     const emailField = document.getElementById('email');
     if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
         isValid = false;
         showError(emailField, 'Adresa de email nu este validă');
     }

     // Validare telefon
     const phoneField = document.getElementById('phone');
     if (phoneField && phoneField.value.trim() && !isValidPhone(phoneField.value)) {
         isValid = false;
         showError(phoneField, 'Numărul de telefon nu este valid');
     }

     return isValid;
 }

 // Funcții de afișare/eliminare erori (aceleași în toate fișierele)
 function showError(field, message) {
     // ... (codul pentru showError) ...
 }

 function clearError(field) {
     // ... (codul pentru clearError) ...
 }

 // Funcții de validare specifice (aceleași în toate fișierele)
 function isValidEmail(email) {
     // ... (codul pentru isValidEmail) ...
 }

 function isValidPhone(phone) {
     // ... (codul pentru isValidPhone) ...
 }

 // Navigare către pasul următor (modificat pentru a folosi link)
 if (toStep2Button) {
     toStep2Button.addEventListener('click', function(e) {
         e.preventDefault();
         if (validateStep1()) {
             window.location.href = "checkout-livrare.html";
         }
     });
 }

 // Redirecționare înapoi la magazin
 if (backToShopLink) {
     backToShopLink.addEventListener('click', function() {
         // Poți adăuga logica de golire a coșului aici, dacă este necesar
     });
 }

 // Adaugă validare în timp real pentru câmpurile formularului
 const allInputs = step1.querySelectorAll('input, select, textarea');
 allInputs.forEach(function(input) {
     input.addEventListener('blur', function() {
         // ... (codul pentru validarea la blur) ...
     });

     input.addEventListener('input', function() {
         // ... (codul pentru eliminarea erorilor la input) ...
     });
 });
});