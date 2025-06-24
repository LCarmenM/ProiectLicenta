document.addEventListener('DOMContentLoaded', function() {
    // Variabile pentru elementele din această pagină
    const step1 = document.getElementById('step-1');
    const toStep2Button = document.getElementById('to-step-2');
    const backToShopLink = document.querySelector('.back-link');

    // Validare pentru pasul 1
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
        errorMessage.style.color = '#f44336';
        errorMessage.style.fontSize = '0.8rem';
        errorMessage.style.marginTop = '5px';
        
        // Inserează mesajul de eroare după câmp
        field.parentNode.appendChild(errorMessage);
    }

    // Funcție pentru eliminarea erorilor
    function clearError(field) {
        // Elimină clasa de eroare
        field.classList.remove('error');
        
        // Elimină mesajul de eroare dacă există
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Funcție pentru validarea email-ului
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Funcție pentru validarea telefonului
    function isValidPhone(phone) {
        // Acceptă numere de telefon în format românesc (10 cifre, poate începe cu +40 sau 0)
        const phoneRegex = /^(\+40|0)[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Navigare către pasul următor
    if (toStep2Button) {
        toStep2Button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Buton "Continuă la livrare" apăsat'); // Pentru debugging
            
            if (validateStep1()) {
                console.log('Validare reușită, redirecționare...'); // Pentru debugging
                
                // Salvează datele în localStorage pentru a le păstra între pagini
                saveFormData();
                
                // Redirecționează la pagina de livrare
                window.location.href = "checkout-livrare.html";
            } else {
                console.log('Validare eșuată'); // Pentru debugging
                
                // Afișează o notificare pentru utilizator
                showNotification('Te rog să completezi toate câmpurile obligatorii corect.', 'error');
                
                // Scroll la primul câmp cu eroare
                const firstErrorField = document.querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
            }
        });
    }

    // Funcție pentru salvarea datelor din formular
    function saveFormData() {
        const formData = {
            firstName: document.getElementById('first-name')?.value || '',
            lastName: document.getElementById('last-name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || ''
        };
        
        localStorage.setItem('checkoutPersonalInfo', JSON.stringify(formData));
        console.log('Date salvate:', formData); // Pentru debugging
    }

    // Funcție pentru încărcarea datelor salvate
    function loadFormData() {
        const savedData = localStorage.getItem('checkoutPersonalInfo');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            if (document.getElementById('first-name')) document.getElementById('first-name').value = formData.firstName || '';
            if (document.getElementById('last-name')) document.getElementById('last-name').value = formData.lastName || '';
            if (document.getElementById('email')) document.getElementById('email').value = formData.email || '';
            if (document.getElementById('phone')) document.getElementById('phone').value = formData.phone || '';
        }
    }

    // Încarcă datele salvate la încărcarea paginii
    loadFormData();

    // Redirecționare înapoi la magazin
    if (backToShopLink) {
        backToShopLink.addEventListener('click', function() {
            // Poți adăuga logica de golire a coșului aici, dacă este necesar
            console.log('Înapoi la magazin');
        });
    }

    // Adaugă validare în timp real pentru câmpurile formularului
    const allInputs = step1.querySelectorAll('input, select, textarea');
    allInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            // Validează câmpul când utilizatorul părăsește câmpul
            if (this.required && !this.value.trim()) {
                showError(this, 'Acest câmp este obligatoriu');
            } else if (this.id === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                showError(this, 'Adresa de email nu este validă');
            } else if (this.id === 'phone' && this.value.trim() && !isValidPhone(this.value)) {
                showError(this, 'Numărul de telefon nu este valid');
            } else {
                clearError(this);
            }
        });

        input.addEventListener('input', function() {
            // Elimină mesajul de eroare în timp ce utilizatorul completează câmpul
            clearError(this);
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
        
        // Adaugă funcționalitatea butonului de închidere
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