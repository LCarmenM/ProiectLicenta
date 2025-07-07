document.addEventListener('DOMContentLoaded', function() {
 // Variabile pentru elementele din această pagină
 const step2 = document.getElementById('step-2');
 const backToStep1Button = document.getElementById('back-to-step-1');
 const toStep3Button = document.getElementById('to-step-3');
 const shippingOptions = document.querySelectorAll('input[name="shipping"]');

 // Funcții de validare specifice acestei pagini
 function validateStep2() {
     const requiredFields = step2.querySelectorAll('input[required], select[required]');
     let isValid = true;

     requiredFields.forEach(function(field) {
         if (!field.value.trim()) {
             isValid = false;
             showError(field, 'Acest câmp este obligatoriu');
         } else {
             clearError(field);
         }
     });

     return isValid;
 }

 // Funcție pentru afișarea erorilor (aceeași ca înainte)
 function showError(field, message) {
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        errorElement.textContent = message;
        field.classList.add('error');
 }

 // Funcție pentru eliminarea erorilor (aceeași ca înainte)
 function clearError(field) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        field.classList.remove('error');
 }

 // Navigare între pași (modificat pentru a folosi link)
 if (backToStep1Button) {
     backToStep1Button.addEventListener('click', function(e) {
         e.preventDefault();
         window.location.href = "checkout-info.html";
     });
 }

 if (toStep3Button) {
     toStep3Button.addEventListener('click', function(e) {
         e.preventDefault();
         if (validateStep2()) {
             window.location.href = "checkout-plata.html";
         }
     });
 }

 // Gestionare opțiuni de livrare (aceeași ca înainte)
 shippingOptions.forEach(function(option) {
     option.addEventListener('change', function() {
         updateShippingCost(this.value);
     });
 });

 // Funcție pentru actualizarea costului de livrare (aceeași ca înainte)
 function updateShippingCost(shippingMethod) {
        const shippingCostElement = document.getElementById('shipping-cost');
        let cost = 0;
    
        switch (shippingMethod) {
            case 'standard':
                cost = 20;
                break;
            case 'express':
                cost = 50;
                break;
            case 'pickup':
                cost = 0;
                break;
            default:
                cost = 0;
        }
    
        shippingCostElement.textContent = `${cost} lei`;
 }

 // Adaugă validare în timp real pentru câmpurile formularului
 const allInputs = step2.querySelectorAll('input, select, textarea');
 allInputs.forEach(function(input) {
     input.addEventListener('blur', function() {

     });

     input.addEventListener('input', function() {
            clearError(input);
     });
 });
});