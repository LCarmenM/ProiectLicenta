document.addEventListener('DOMContentLoaded', function() {
    // Variabile pentru elementele din pagină
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodHeaders = document.querySelectorAll('.payment-method-header');
    const backToStep2Button = document.getElementById('back-to-step-2');
    const placeOrderButton = document.getElementById('place-order-btn');
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const closeModalButton = document.querySelector('.close-modal');
    const termsCheckbox = document.getElementById('terms');
  
    // Inițializare elemente
    initPaymentMethods();
    initBackButton();
    initPlaceOrderButton();
    initModalControls();
    initFormValidation();
  
    // Funcție pentru inițializarea metodelor de plată
    function initPaymentMethods() {
      paymentMethodHeaders.forEach(header => {
        header.addEventListener('click', function() {
          // Obținem metoda de plată asociată headerului
          const methodId = this.getAttribute('data-method');
          const methodElement = this.closest('.payment-method');
          
          // Dezactivăm toate metodele de plată
          paymentMethods.forEach(method => {
            method.classList.remove('active');
          });
          
          // Activăm metoda selectată
          methodElement.classList.add('active');
          
          // Actualizăm UI-ul pentru a reflecta selecția
          updatePaymentMethodUI(methodId);
        });
      });
    }
  
    // Funcție pentru actualizarea UI-ului metodelor de plată
    function updatePaymentMethodUI(selectedMethodId) {
      // Putem actualiza și alte elemente din UI în funcție de metoda selectată
      // De exemplu, afișăm informații specifice sau ajustăm costurile
      console.log(`Metodă de plată selectată: ${selectedMethodId}`);
  
      // Dacă este necesar, putem actualiza și sumarul comenzii
      if (selectedMethodId === 'cash') {
        // Pentru plata la livrare am putea adăuga un cost suplimentar
        // updateShippingSummary();
      }
    }
  
    // Funcție pentru butonul de înapoi
    function initBackButton() {
      if (backToStep2Button) {
        backToStep2Button.addEventListener('click', function(e) {
          // În acest caz, linkul va naviga automat către checkout-livrare.html
          // Dacă dorim să salvăm datele, am putea face asta înainte de navigare
          saveFormData();
        });
      }
    }
  
    // Funcție pentru butonul de plasare comandă
    function initPlaceOrderButton() {
      if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Validăm formularul înainte de a plasa comanda
          if (validateForm()) {
            // Simulăm procesarea plății
            processPayment();
          }
        });
      }
    }
  
    // Funcție pentru validarea formularului
    function validateForm() {
      let isValid = true;
      
      // Verificăm dacă termenii și condițiile sunt acceptate
      if (termsCheckbox && !termsCheckbox.checked) {
        showError(termsCheckbox, 'Trebuie să accepți termenii și condițiile');
        isValid = false;
      } else if (termsCheckbox) {
        clearError(termsCheckbox);
      }
      
      // Verificăm datele cardului dacă metoda de plată este cardul
      const cardMethod = document.getElementById('card-method');
      if (cardMethod && cardMethod.classList.contains('active')) {
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
  
    // Funcție pentru procesarea plății
    function processPayment() {
      // Dezactivăm butonul în timpul procesării
      placeOrderButton.disabled = true;
      placeOrderButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se procesează...';
      
      // Simulăm o cerere asincronă către server (într-o aplicație reală)
      setTimeout(function() {
        // După procesarea cu succes, afișăm modalul de confirmare
        if (orderConfirmationModal && confirmationOverlay) {
          orderConfirmationModal.classList.add('active');
          confirmationOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        
        // Resetăm butonul
        placeOrderButton.disabled = false;
        placeOrderButton.innerHTML = 'Trimite comanda';
      }, 2000);
    }
  
    // Funcție pentru inițializarea controalelor modalului
    function initModalControls() {
      if (closeModalButton && orderConfirmationModal && confirmationOverlay) {
        closeModalButton.addEventListener('click', closeModal);
        confirmationOverlay.addEventListener('click', closeModal);
      }
    }
  
    // Funcție pentru închiderea modalului
    function closeModal() {
      if (orderConfirmationModal && confirmationOverlay) {
        orderConfirmationModal.classList.remove('active');
        confirmationOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Opțional: redirecționăm utilizatorul la o pagină de confirmare
        // sau la pagina principală după închiderea modalului
        // window.location.href = 'index.html';
      }
    }
  
    // Funcție pentru inițializarea validării formularului în timp real
    function initFormValidation() {
      // Adăugăm validare în timp real pentru câmpurile cardului
      const cardInputs = document.querySelectorAll('#card-details input');
      
      cardInputs.forEach(function(input) {
        // Validare la pierderea focusului
        input.addEventListener('blur', function() {
          validateField(this);
        });
        
        // Curățăm eroarea la introducerea de date noi
        input.addEventListener('input', function() {
          clearError(this);
        });
      });
  
      // Formatare automată pentru numărul cardului
      const cardNumberInput = document.getElementById('card-number');
      if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
          let value = this.value.replace(/\D/g, '');
          let formattedValue = '';
          
          for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
              formattedValue += ' ';
            }
            formattedValue += value[i];
          }
          
          this.value = formattedValue;
        });
      }
  
      // Formatare automată pentru data expirării
      const cardExpiryInput = document.getElementById('card-expiry');
      if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
          let value = this.value.replace(/\D/g, '');
          let formattedValue = '';
          
          if (value.length > 0) {
            formattedValue = value.substring(0, 2);
            if (value.length > 2) {
              formattedValue += '/' + value.substring(2, 4);
            }
          }
          
          this.value = formattedValue;
        });
      }
    }
  
    // Funcție pentru validarea unui câmp specific
    function validateField(field) {
      if (field.required && !field.value.trim()) {
        showError(field, 'Acest câmp este obligatoriu');
        return false;
      }
      
      if (field.id === 'card-number' && !isValidCardNumber(field.value)) {
        showError(field, 'Numărul cardului trebuie să conțină 16 cifre');
        return false;
      }
      
      if (field.id === 'card-expiry' && !isValidExpiry(field.value)) {
        showError(field, 'Format valid: LL/AA');
        return false;
      }
      
      if (field.id === 'card-cvv' && !isValidCVV(field.value)) {
        showError(field, 'CVV trebuie să conțină 3 cifre');
        return false;
      }
      
      clearError(field);
      return true;
    }
  
    // Funcție pentru afișarea erorilor
    function showError(field, message) {
      // Curățăm orice eroare existentă
      clearError(field);
      
      // Adăugăm clasa de eroare la câmp
      field.classList.add('error');
      
      // Creăm și adăugăm mesajul de eroare
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      // Adăugăm mesajul după câmp
      field.parentNode.appendChild(errorElement);
    }
  
    // Funcție pentru curățarea erorilor
    function clearError(field) {
      // Eliminăm clasa de eroare
      field.classList.remove('error');
      
      // Căutăm și eliminăm mesajul de eroare dacă există
      const errorElement = field.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }
  
    // Funcții de validare pentru câmpurile cardului
    function isValidCardNumber(cardNumber) {
      // Eliminăm spațiile și verificăm dacă sunt 16 cifre
      const cleanedNumber = cardNumber.replace(/\s/g, '');
      return /^\d{16}$/.test(cleanedNumber);
    }
  
    function isValidExpiry(expiry) {
      // Verifică formatul LL/AA
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
      }
      
      // Verifică dacă luna este validă (01-12)
      const month = parseInt(expiry.split('/')[0], 10);
      if (month < 1 || month > 12) {
        return false;
      }
      
      // Verifică dacă data nu a expirat
      const year = parseInt('20' + expiry.split('/')[1], 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
      }
      
      return true;
    }
  
    function isValidCVV(cvv) {
      // Verifică dacă sunt 3 cifre
      return /^\d{3}$/.test(cvv);
    }
  
    // Funcție pentru salvarea datelor formularului (opțional, pentru a menține starea între pași)
    function saveFormData() {
      // Aici am putea salva datele în localStorage sau în starea aplicației
      // pentru a le recupera dacă utilizatorul revine la acest pas
      console.log('Datele formularului au fost salvate');
    }
  
    // Funcție pentru afișarea notificărilor
    function showNotification(message, type = 'info') {
      // Verificăm dacă există deja o notificare
      const existingNotification = document.querySelector('.notification');
      
      if (existingNotification) {
        existingNotification.remove();
      }
      
      // Creăm elementul notificării
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span>${message}</span>
          <button class="close-notification">&times;</button>
        </div>
      `;
      
      // Adăugăm notificarea în DOM
      document.body.appendChild(notification);
      
      // Afișăm notificarea cu o mică întârziere pentru animație
      setTimeout(() => {
        notification.classList.add('active');
      }, 10);
      
      // Configurăm butonul de închidere
      const closeButton = notification.querySelector('.close-notification');
      closeButton.addEventListener('click', () => {
        notification.classList.remove('active');
        
        setTimeout(() => {
          notification.remove();
        }, 300);
      });
      
      // Ascundem notificarea după 5 secunde
      setTimeout(() => {
        notification.classList.remove('active');
        
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    }
  });