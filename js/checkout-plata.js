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
  
    // INIȚIALIZARE SISTEM DE VALIDARE
    initializePaymentValidation();
  
    // Inițializare elemente
    initPaymentMethods();
    initBackButton();
    initPlaceOrderButton();
    initModalControls();
  
    // === SISTEM DE VALIDARE PENTRU PLATĂ ===
    function initializePaymentValidation() {
        setupFormValidation();
        setupRealTimeValidation();
        setupCardFormatting();
        updatePlaceOrderButtonState();
    }
  
    function setupFormValidation() {
        // Dezactivează validarea nativă pentru întregul formular
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.setAttribute('novalidate', 'true');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        const allInputs = document.querySelectorAll('input, select, textarea');
        
        allInputs.forEach(input => {
            // Dezactivează complet validarea nativă
            input.setAttribute('novalidate', 'true');
            
            // Elimină event-urile native de validare
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
                updatePlaceOrderButtonState();
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
                updatePlaceOrderButtonState();
            });
            
            if (input.type === 'checkbox') {
                input.addEventListener('change', function() {
                    validateField(this);
                    updatePlaceOrderButtonState();
                });
            }
        });
    }
  
    function setupRealTimeValidation() {
        const cardInputs = document.querySelectorAll('#card-number, #card-expiry, #card-cvv, #card-name');
        
        cardInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 2) {
                    setTimeout(() => validateField(this), 300);
                }
            });
        });
    }
  
    function setupCardFormatting() {
        const cardNumberInput = document.getElementById('card-number');
        const cardExpiryInput = document.getElementById('card-expiry');
        
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                formatCardNumber(e);
                if (this.value.replace(/\s/g, '').length >= 13) {
                    validateCardNumber(this);
                }
            });
        }
        
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function(e) {
                formatCardExpiry(e);
                if (this.value.length === 5) {
                    validateCardExpiry(this);
                }
            });
        }
    }
  
    // === VALIDARE CÂMPURI ===
    function validateField(field) {
        const fieldType = field.type;
        const fieldValue = field.value.trim();
        const fieldId = field.id;
        
        clearFieldError(field);
        
        // Verificare dacă metoda de plată cu card este selectată
        const cardMethod = document.getElementById('card-method');
        const isCardSelected = cardMethod && cardMethod.classList.contains('active');
        
        // Validare termeni și condiții
        if (field.id === 'terms' && !field.checked) {
            showFieldError(field, 'Trebuie să accepți termenii și condițiile pentru a continua');
            return false;
        }
        
        // Validare câmpuri card doar dacă metoda card este selectată
        if (isCardSelected && field.closest('#card-details')) {
            if (field.hasAttribute('required') && !fieldValue) {
                showFieldError(field, 'Acest câmp este obligatoriu pentru plata cu cardul');
                return false;
            }
            
            switch (fieldId) {
                case 'card-number':
                    return validateCardNumber(field);
                case 'card-expiry':
                    return validateCardExpiry(field);
                case 'card-cvv':
                    return validateCardCVV(field);
                case 'card-name':
                    return validateCardName(field);
            }
        }
        
        return true;
    }
  
    function validateCardNumber(field) {
        const value = field.value.replace(/\s/g, '');
        const cardRegex = /^\d{16}$/;
        
        if (!cardRegex.test(value)) {
            showFieldError(field, 'Numărul cardului trebuie să conțină exact 16 cifre');
            return false;
        }
        
        // Validare Luhn algorithm pentru carduri reale
        if (!isValidCardNumber(value)) {
            showFieldError(field, 'Numărul cardului nu este valid');
            return false;
        }
        
        clearFieldError(field);
        field.classList.add('valid');
        return true;
    }
  
    function validateCardExpiry(field) {
        const value = field.value;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        
        if (!expiryRegex.test(value)) {
            showFieldError(field, 'Data expirării trebuie să fie în formatul LL/AA (ex: 12/25)');
            return false;
        }
        
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const cardYear = parseInt(year);
        const cardMonth = parseInt(month);
        
        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            showFieldError(field, 'Cardul a expirat. Te rog să introduci o dată validă');
            return false;
        }
        
        if (cardYear > currentYear + 10) {
            showFieldError(field, 'Data expirării pare să fie prea în viitor');
            return false;
        }
        
        clearFieldError(field);
        field.classList.add('valid');
        return true;
    }
  
    function validateCardCVV(field) {
        const cvvRegex = /^\d{3,4}$/;
        const value = field.value;
        
        if (!cvvRegex.test(value)) {
            showFieldError(field, 'CVV-ul trebuie să conțină 3 cifre');
            return false;
        }
        
        clearFieldError(field);
        field.classList.add('valid');
        return true;
    }
  
    function validateCardName(field) {
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        const value = field.value.trim();
        
        if (!nameRegex.test(value)) {
            showFieldError(field, 'Numele trebuie să conțină cel puțin 2 caractere și doar litere');
            return false;
        }
        
        clearFieldError(field);
        field.classList.add('valid');
        return true;
    }
  
    // === FORMATARE AUTOMATĂ ===
    function formatCardNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    }
  
    function formatCardExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = value.substring(0, 2);
            if (value.length > 2) {
                formattedValue += '/' + value.substring(2, 4);
            }
        }
        
        e.target.value = formattedValue;
    }
  
    // === ALGORITM LUHN PENTRU VALIDARE CARD ===
    function isValidCardNumber(cardNumber) {
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    }
  
    // === AFIȘARE/CURĂȚARE ERORI CU TEXT ROȘU ===
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        clearFieldError(field, false);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#f44336'; // Roșu
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.fontWeight = '400';
        
        field.parentNode.appendChild(errorElement);
        
        // Previne afișarea tooltip-ului browserului
        field.setCustomValidity('');
    }
  
    function clearFieldError(field, removeClass = true) {
        if (removeClass) {
            field.classList.remove('error');
        }
        
        // Elimină validarea customă pentru a opri mesajele browserului
        field.setCustomValidity('');
        
        const nextElement = field.nextElementSibling;
        if (nextElement && nextElement.classList.contains('error-message')) {
            nextElement.remove();
        }
        
        // Caută și în parentNode pentru mesajele de eroare
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
  
    // === ACTUALIZARE STARE BUTON ===
    function updatePlaceOrderButtonState() {
        if (!placeOrderButton) return;
        
        const isValid = validateAllFields();
        
        if (isValid) {
            placeOrderButton.classList.remove('disabled');
            placeOrderButton.disabled = false;
        } else {
            placeOrderButton.classList.add('disabled');
            placeOrderButton.disabled = true;
        }
    }
  
    function validateAllFields() {
        // Validare termeni și condiții
        if (termsCheckbox && !termsCheckbox.checked) {
            return false;
        }
        
        // Verificare dacă metoda de plată cu card este selectată
        const cardMethod = document.getElementById('card-method');
        const isCardSelected = cardMethod && cardMethod.classList.contains('active');
        
        if (isCardSelected) {
            const cardFields = document.querySelectorAll('#card-details input[required]');
            for (let field of cardFields) {
                if (!field.value.trim() || field.classList.contains('error')) {
                    return false;
                }
            }
        }
        
        return true;
    }
  
    // === VALIDARE COMPLETĂ LA APĂSAREA BUTONULUI ===
    function validateAllFieldsOnSubmit() {
        let isValid = true;
        let firstErrorField = null;
        
        // Validare termeni și condiții
        if (termsCheckbox && !termsCheckbox.checked) {
            showFieldError(termsCheckbox, 'Trebuie să accepți termenii și condițiile');
            isValid = false;
            if (!firstErrorField) firstErrorField = termsCheckbox;
        }
        
        // Verificare dacă metoda de plată cu card este selectată
        const cardMethod = document.getElementById('card-method');
        const isCardSelected = cardMethod && cardMethod.classList.contains('active');
        
        if (isCardSelected) {
            // Validează toate câmpurile cardului folosind data-required
            const cardFields = document.querySelectorAll('#card-details input[data-required="true"]');
            
            cardFields.forEach(function(field) {
                // Verifică dacă câmpul este gol
                if (!field.value.trim()) {
                    showFieldError(field, 'Acest câmp este obligatoriu pentru plata cu cardul');
                    isValid = false;
                    if (!firstErrorField) firstErrorField = field;
                } else {
                    // Dacă câmpul nu e gol, validează conținutul
                    if (!validateField(field)) {
                        isValid = false;
                        if (!firstErrorField) firstErrorField = field;
                    }
                }
            });
        }
        
        // Scroll la primul câmp cu eroare
        if (firstErrorField) {
            firstErrorField.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setTimeout(() => {
                firstErrorField.focus();
            }, 300);
        }
        
        return isValid;
    }
  
    // === FUNCȚIONALITĂȚI EXISTENTE ===
    function initPaymentMethods() {
        paymentMethodHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const methodId = this.getAttribute('data-method');
                const methodElement = this.closest('.payment-method');
                
                paymentMethods.forEach(method => {
                    method.classList.remove('active');
                });
                
                methodElement.classList.add('active');
                updatePaymentMethodUI(methodId);
                updatePlaceOrderButtonState();
            });
        });
    }
  
    function updatePaymentMethodUI(selectedMethodId) {
        console.log(`Metodă de plată selectată: ${selectedMethodId}`);
        
        // Curăță erorile când se schimbă metoda de plată
        if (selectedMethodId !== 'card') {
            const cardFields = document.querySelectorAll('#card-details input');
            cardFields.forEach(field => {
                clearFieldError(field);
                field.classList.remove('valid');
            });
        }
    }
  
    function initBackButton() {
        if (backToStep2Button) {
            backToStep2Button.addEventListener('click', function(e) {
                saveFormData();
            });
        }
    }
  
    function initPlaceOrderButton() {
        if (placeOrderButton) {
            // Elimină atributul required din toate câmpurile pentru a dezactiva validarea nativă
            const form = placeOrderButton.closest('form') || document.querySelector('form');
            if (form) {
                form.setAttribute('novalidate', 'true');
            }
            
            // Dezactivează validarea HTML5 pentru toate câmpurile
            const allRequiredInputs = document.querySelectorAll('input[required]');
            allRequiredInputs.forEach(input => {
                input.removeAttribute('required');
                input.setAttribute('data-required', 'true'); // Păstrăm info pentru validarea noastră
            });
            
            placeOrderButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // VALIDEAZĂ TOATE CÂMPURILE AUTOMAT
                if (validateAllFieldsOnSubmit()) {
                    processPayment();
                } else {
                    showNotification('Te rog să completezi toate câmpurile obligatorii corect.', 'error');
                }
            });
        }
    }
  
    function processPayment() {
        placeOrderButton.disabled = true;
        placeOrderButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se procesează plata...';
        
        setTimeout(function() {
            if (orderConfirmationModal && confirmationOverlay) {
                orderConfirmationModal.classList.add('active');
                confirmationOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            placeOrderButton.disabled = false;
            placeOrderButton.innerHTML = 'Trimite comanda';
        }, 2000);
    }
  
    function initModalControls() {
        if (closeModalButton && orderConfirmationModal && confirmationOverlay) {
            closeModalButton.addEventListener('click', closeModal);
            confirmationOverlay.addEventListener('click', closeModal);
        }
    }
  
    function closeModal() {
        if (orderConfirmationModal && confirmationOverlay) {
            orderConfirmationModal.classList.remove('active');
            confirmationOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
  
    function saveFormData() {
        console.log('Datele formularului au fost salvate');
    }
  
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        setTimeout(() => {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
  });