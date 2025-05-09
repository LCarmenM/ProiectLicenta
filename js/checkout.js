document.addEventListener('DOMContentLoaded', function() {
    // Variabile pentru pașii de checkout
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const stepIndicator1 = document.getElementById('step-indicator-1');
    const stepIndicator2 = document.getElementById('step-indicator-2');
    const stepIndicator3 = document.getElementById('step-indicator-3');
    
    const connector12 = document.getElementById('connector-1-2');
    const connector23 = document.getElementById('connector-2-3');
    
    // Butoane pentru navigare între pași
    const toStep2Button = document.getElementById('to-step-2');
    const backToStep1Button = document.getElementById('back-to-step-1');
    const toStep3Button = document.getElementById('to-step-3');
    const backToStep2Button = document.getElementById('back-to-step-2');
    const placeOrderButton = document.getElementById('place-order-btn');
    
    // Modal de confirmare
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const closeModalButton = document.querySelector('.close-modal');
    
    // Opțiuni de plată
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    
    // Opțiuni de livrare
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    // Pasul 1 -> Pasul 2
    if (toStep2Button) {
        toStep2Button.addEventListener('click', function() {
            // Validează câmpurile din pasul 1
            if (validateStep1()) {
                // Ascunde pasul 1 și afișează pasul 2
                step1.classList.remove('active');
                step2.classList.add('active');
                
                // Actualizează indicatorii de pas
                stepIndicator1.classList.remove('active');
                stepIndicator1.classList.add('completed');
                stepIndicator2.classList.add('active');
                
                // Actualizează conectorul
                connector12.classList.add('active');
                
                // Scroll la începutul formularului
                scrollToTop();
            }
        });
    }
    
    // Pasul 2 -> Pasul 1
    if (backToStep1Button) {
        backToStep1Button.addEventListener('click', function() {
            // Ascunde pasul 2 și afișează pasul 1
            step2.classList.remove('active');
            step1.classList.add('active');
            
            // Actualizează indicatorii de pas
            stepIndicator2.classList.remove('active');
            stepIndicator1.classList.remove('completed');
            stepIndicator1.classList.add('active');
            
            // Actualizează conectorul
            connector12.classList.remove('active');
            
            // Scroll la începutul formularului
            scrollToTop();
        });
    }
    
    // Pasul 2 -> Pasul 3
    if (toStep3Button) {
        toStep3Button.addEventListener('click', function() {
            // Validează câmpurile din pasul 2
            if (validateStep2()) {
                // Ascunde pasul 2 și afișează pasul 3
                step2.classList.remove('active');
                step3.classList.add('active');
                
                // Actualizează indicatorii de pas
                stepIndicator2.classList.remove('active');
                stepIndicator2.classList.add('completed');
                stepIndicator3.classList.add('active');
                
                // Actualizează conectorul
                connector23.classList.add('active');
                
                // Scroll la începutul formularului
                scrollToTop();
            }
        });
    }
    
    // Pasul 3 -> Pasul 2
    if (backToStep2Button) {
        backToStep2Button.addEventListener('click', function() {
            // Ascunde pasul 3 și afișează pasul 2
            step3.classList.remove('active');
            step2.classList.add('active');
            
            // Actualizează indicatorii de pas
            stepIndicator3.classList.remove('active');
            stepIndicator2.classList.remove('completed');
            stepIndicator2.classList.add('active');
            
            // Actualizează conectorul
            connector23.classList.remove('active');
            
            // Scroll la începutul formularului
            scrollToTop();
        });
    }
    
    // Finalizează comanda
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Validează câmpurile din pasul 3
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
    
    // Închide modalul de confirmare
    if (closeModalButton && orderConfirmationModal && confirmationOverlay) {
        closeModalButton.addEventListener('click', function() {
            orderConfirmationModal.classList.remove('active');
            orderConfirmationModal.style.opacity = '0';
            orderConfirmationModal.style.visibility = 'hidden';
            
            confirmationOverlay.classList.remove('active');
            confirmationOverlay.style.opacity = '0';
            confirmationOverlay.style.visibility = 'hidden';
            
            document.body.style.overflow = '';
        });
    }
    
    if (confirmationOverlay && orderConfirmationModal) {
        confirmationOverlay.addEventListener('click', function() {
            orderConfirmationModal.classList.remove('active');
            orderConfirmationModal.style.opacity = '0';
            orderConfirmationModal.style.visibility = 'hidden';
            
            confirmationOverlay.classList.remove('active');
            confirmationOverlay.style.opacity = '0';
            confirmationOverlay.style.visibility = 'hidden';
            
            document.body.style.overflow = '';
        });
    }
    
    // Gestionare opțiuni de plată
    paymentOptions.forEach(function(option) {
        option.addEventListener('change', function() {
            // Ascunde toate detaliile de plată
            document.querySelectorAll('.payment-method-details').forEach(function(detail) {
                detail.classList.remove('active');
            });
            
            // Afișează detaliile metodei de plată selectate
            const detailsElement = document.getElementById(this.value + '-details');
            if (detailsElement) {
                detailsElement.classList.add('active');
            }
        });
    });
    
    // Gestionare opțiuni de livrare
    shippingOptions.forEach(function(option) {
        option.addEventListener('change', function() {
            // Actualizează costul de livrare și totalul
            updateShippingCost(this.value);
        });
    });
    
    // Funcția de validare pentru pasul 1
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
    
    // Funcția de validare pentru pasul 2
    function validateStep2() {
        // Validează câmpurile de adresă din pasul 2
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
    
    // Funcția de validare pentru pasul 3
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
    
    // Funcție pentru afișarea erorilor
    function showError(field, message) {
        // Elimină mesajele de eroare existente
        clearError(field);
        
        // Adaugă clasa de eroare la câmp
        field.classList.add('error');
        
        // Creează mesajul de eroare
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Inserează mesajul de eroare după câmp
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    
    // Funcție pentru eliminarea erorilor
    function clearError(field) {
        // Elimină clasa de eroare
        field.classList.remove('error');
        
        // Elimină mesajul de eroare dacă există
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }
    
    // Funcție pentru validarea adresei de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Funcție pentru validarea numărului de telefon
    function isValidPhone(phone) {
        // Acceptă numere de telefon în format românesc (10 cifre, poate începe cu +40 sau 0)
        const phoneRegex = /^(\+40|0)[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Funcție pentru validarea numărului cardului
    function isValidCardNumber(cardNumber) {
        // Elimină spațiile și verifică dacă sunt 16 cifre
        const cleanedNumber = cardNumber.replace(/\s/g, '');
        return /^\d{16}$/.test(cleanedNumber);
    }
    
    // Funcție pentru validarea datei de expirare
    function isValidExpiry(expiry) {
        // Verifică formatul LL/AA
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    }
    
    // Funcție pentru validarea CVV
    function isValidCVV(cvv) {
        // Verifică dacă sunt 3 cifre
        return /^\d{3}$/.test(cvv);
    }
    
    // Funcție pentru actualizarea costului de livrare
    function updateShippingCost(shippingMethod) {
        const shippingCostElement = document.querySelector('.shipping-cost span:last-child');
        const totalElement = document.querySelector('.total-row span:last-child');
        const subtotal = 500; // În aplicația reală, acest preț ar fi calculat dinamic
        
        let shippingCost = 0;
        
        if (shippingMethod === 'express') {
            shippingCost = 15;
            shippingCostElement.textContent = '15 lei';
        } else {
            shippingCostElement.textContent = 'Gratuit';
        }
        
        const total = subtotal + shippingCost;
        totalElement.textContent = `${total} lei`;
    }
    
    // Funcție pentru a face scroll la începutul formularului
    function scrollToTop() {
        window.scrollTo({
            top: document.querySelector('.checkout-steps').offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Adaugă validare în timp real pentru câmpurile formularului
    const allInputs = document.querySelectorAll('input, select, textarea');
    
    allInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            // Validează câmpul când utilizatorul părăsește câmpul
            if (this.required && !this.value.trim()) {
                showError(this, 'Acest câmp este obligatoriu');
            } else if (this.id === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                showError(this, 'Adresa de email nu este validă');
            } else if (this.id === 'phone' && this.value.trim() && !isValidPhone(this.value)) {
                showError(this, 'Numărul de telefon nu este valid');
            } else if (this.id === 'card-number' && this.value.trim() && !isValidCardNumber(this.value)) {
                showError(this, 'Numărul cardului trebuie să conțină 16 cifre');
            } else if (this.id === 'card-expiry' && this.value.trim() && !isValidExpiry(this.value)) {
                showError(this, 'Format valid: LL/AA');
            } else if (this.id === 'card-cvv' && this.value.trim() && !isValidCVV(this.value)) {
                showError(this, 'CVV trebuie să conțină 3 cifre');
            } else {
                clearError(this);
            }
        });
        
        input.addEventListener('input', function() {
            // Elimină mesajul de eroare în timp ce utilizatorul completează câmpul
            this.classList.remove('error');
            const errorMessage = this.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        });
    });

    // Funcție pentru afișarea notificărilor
    function showNotification(message, type) {
        // Verifică dacă există deja o notificare
        const existingNotification = document.querySelector('.notification');
        
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Creează notificarea
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        // Adaugă notificarea în DOM
        document.body.appendChild(notification);
        
        // Afișează notificarea (cu o mică întârziere pentru animație)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Adaugă butonul de închidere
        const closeButton = notification.querySelector('.close-notification');
        
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                notification.classList.remove('active');
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Ascunde notificarea după 5 secunde
        setTimeout(() => {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});