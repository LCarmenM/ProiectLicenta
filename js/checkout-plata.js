document.addEventListener('DOMContentLoaded', function() {
 // Variabile pentru elementele din această pagină
 const step3 = document.getElementById('step-3');
 const backToStep2Button = document.getElementById('back-to-step-2');
 const placeOrderButton = document.getElementById('place-order-btn');
 const orderConfirmationModal = document.getElementById('orderConfirmationModal');
 const confirmationOverlay = document.getElementById('confirmationOverlay');
 const closeModalButton = document.querySelector('.close-modal');
 const paymentOptions = document.querySelectorAll('input[name="payment"]');

 // Funcții de validare specifice acestei pagini
 function validateStep3() {
     let isValid = true;

     // Verifică dacă utilizatorul a acceptat termenii și condițiile
     const termsCheckbox = document.getElementById('terms');
     if (termsCheckbox && !termsCheckbox.checked) {
         isValid = false;
         showError(termsCheckbox, 'Trebuie să accepți termenii și condițiile');
     } else if (termsCheckbox) {
         clearError(termsCheckbox);
     }

     // Verifică detaliile cardului dacă metoda de plată este cardul
     const cardPayment = document.getElementById('card');
     if (cardPayment && cardPayment.checked) {
         const cardFields = document.querySelectorAll('#card-details input[required]');

         cardFields.forEach(function(field) {
             if (!field.value.trim()) {
                 isValid = false;
                 showError(field, 'Acest câmp este obligatoriu');
             } else {
                 // Validări specifice pentru câmpurile cardului
                 if (field.id === 'card-number' && !isValidCardNumber(field.value)) {
                     isValid = false;
                     showError(field, 'Numărul cardului trebuie să conțină 16 cifre');
                 } else if (field.id === 'card-expiry' && !isValidExpiry(field.value)) {
                     isValid = false;
                     showError(field, 'Format valid: LL/AA');
                 } else if (field.id === 'card-cvv' && !isValidCVV(field.value)) {
                     isValid = false;
                     showError(field, 'CVV trebuie să conțină 3 cifre');
                 } else {
                     clearError(field);
                 }
             }
         });
     }

     return isValid;
 }

 // Funcție pentru afișarea erorilor (aceeași ca înainte)
 function showError(field, message) {
     // ... (codul pentru showError) ...
 }

 // Funcție pentru eliminarea erorilor (aceeași ca înainte)
 function clearError(field) {
     // ... (codul pentru clearError) ...
 }

 // Funcții de validare specifice (aceleași ca înainte)
 function isValidCardNumber(cardNumber) {
     // ... (codul pentru isValidCardNumber) ...
 }

 function isValidExpiry(expiry) {
     // ... (codul pentru isValidExpiry) ...
 }

 function isValidCVV(cvv) {
     // ... (codul pentru isValidCVV) ...
 }

 // Navigare înapoi la pasul anterior (modificat pentru a folosi link)
 if (backToStep2Button) {
     backToStep2Button.addEventListener('click', function(e) {
         e.preventDefault();
         window.location.href = "checkout-livrare.html";
     });
 }

 // Finalizarea comenzii (aceeași ca înainte)
 if (placeOrderButton) {
     placeOrderButton.addEventListener('click', function(e) {
         e.preventDefault();
         if (validateStep3()) {
             // Simulează trimiterea comenzii la server
             placeOrderButton.disabled = true;
             placeOrderButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se procesează...';

             // După 2 secunde, afișează modalul de confirmare
             setTimeout(function() {
                 // Afișează modalul de confirmare
                 if (orderConfirmationModal && confirmationOverlay) {
                     orderConfirmationModal.style.opacity = '1';
                     orderConfirmationModal.style.visibility = 'visible';
                     orderConfirmationModal.classList.add('active');

                     confirmationOverlay.style.opacity = '1';
                     confirmationOverlay.style.visibility = 'visible';
                     confirmationOverlay.classList.add('active');

                     document.body.style.overflow = 'hidden';
                 }

                 // Resetează butonul
                 placeOrderButton.disabled = false;
                 placeOrderButton.innerHTML = 'Plasează comanda';
             }, 2000);
         }
     });
 }

 // Închiderea modalului de confirmare (aceeași ca înainte)
 if (closeModalButton && orderConfirmationModal && confirmationOverlay) {
     closeModalButton.addEventListener('click', function() {
         // ... (codul pentru închiderea modalului) ...
     });
 }

 if (confirmationOverlay && orderConfirmationModal) {
     confirmationOverlay.addEventListener('click', function() {
         // ... (codul pentru închiderea modalului la click pe overlay) ...
     });
 }

 // Gestionarea opțiunilor de plată (aceeași ca înainte)
 paymentOptions.forEach(function(option) {
     option.addEventListener('change', function() {
         // ... (codul pentru gestionarea opțiunilor de plată) ...
     });
 });

 // Adaugă validare în timp real pentru câmpurile formularului (aceeași ca înainte)
 const allInputs = step3.querySelectorAll('input, select, textarea');
 allInputs.forEach(function(input) {
     input.addEventListener('blur', function() {
         // ... (codul pentru validarea la blur) ...
     });

     input.addEventListener('input', function() {
         // ... (codul pentru eliminarea erorilor la input) ...
     });
 });

 // Funcție pentru afișarea notificărilor (aceeași ca înainte)
 function showNotification(message, type) {
     // ... (codul pentru showNotification) ...
 }
});