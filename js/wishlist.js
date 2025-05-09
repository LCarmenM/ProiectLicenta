document.addEventListener('DOMContentLoaded', function() {
    // Inițializare pagină favorite
    initWishlist();
    
    // Inițializare butoane de alertă de preț
    initPriceAlerts();
    
    // Adăugare în coș
    initAddToCartButtons();
    
    // Eliminare din favorite
    initRemoveButtons();
    
    // Sortare produse favorite
    initSorting();
    
    // Acțiuni globale (adaugă toate, golește lista)
    initGlobalActions();
    
    // Modal setări alertă
    initAlertModal();
    
    // Implementare pentru istoricul de prețuri
    initPriceHistory();
});

// Inițializare pagină
function initWishlist() {
    // Verifică dacă există produse în lista de favorite
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const recommendationsSection = document.querySelector('.recommendations');
    const wishlistCount = document.querySelector('.wishlist-count');
    const wishlistControls = document.querySelector('.wishlist-controls');
    
    if (wishlistItems.length === 0) {
        // Afișează mesajul de listă goală
        if (emptyWishlist && wishlistGrid && recommendationsSection) {
            emptyWishlist.style.display = 'block';
            wishlistGrid.style.display = 'none';
            wishlistControls.style.display = 'none';
            recommendationsSection.style.display = 'none';
        }
    } else {
        // Actualizează contorul de produse
        if (wishlistCount) {
            wishlistCount.textContent = `${wishlistItems.length} produse`;
        }
    }
    
    // Inițializează starea alertelor din localStorage
    initializeAlertStates();
}

// Inițializare butoane de alertă de preț
function initPriceAlerts() {
    const priceAlertToggles = document.querySelectorAll('.price-alert-toggle');
    
    priceAlertToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const wishlistItem = this.closest('.wishlist-item');
            const productId = wishlistItem.getAttribute('data-product-id');
            
            if (this.classList.contains('active')) {
                // Dezactivare alertă
                deactivatePriceAlert(productId);
                updateAlertToggleState(this, false);
            } else {
                // Deschide modal pentru setări alertă
                openAlertModal(productId);
            }
        });
    });
}

// Deschide modal setări alertă
function openAlertModal(productId) {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    const wishlistItem = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
    
    if (modal && overlay && wishlistItem) {
        // Populează modal cu datele produsului
        const productImage = wishlistItem.querySelector('.product-image img');
        const productName = wishlistItem.querySelector('.product-name');
        const productPrice = wishlistItem.querySelector('.current-price');
        
        document.getElementById('alertProductImage').src = productImage.src;
        document.getElementById('alertProductName').textContent = productName.textContent;
        document.getElementById('alertProductPrice').textContent = productPrice.textContent;
        
        // Setează ID-ul produsului în atributul modal
        modal.setAttribute('data-product-id', productId);
        
        // Încarcă setările salvate anterior (dacă există)
        loadSavedAlertSettings(productId);
        
        // Afișează modal
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Inițializare modal setări alertă
function initAlertModal() {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-alert');
    const saveBtn = document.querySelector('.save-alert');
    
    if (modal && overlay) {
        // Închide modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeAlertModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAlertModal);
        }
        
        overlay.addEventListener('click', closeAlertModal);
        
        // Salvează setările alertei
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const productId = modal.getAttribute('data-product-id');
                saveAlertSettings(productId);
                closeAlertModal();
                
                // Actualizează UI
                const alertToggle = document.querySelector(`.wishlist-item[data-product-id="${productId}"] .price-alert-toggle`);
                if (alertToggle) {
                    updateAlertToggleState(alertToggle, true);
                }
                
                showNotification(`Alerta de preț a fost activată`, 'success');
            });
        }
        
        // Controlează opțiunile de alertă
        const alertTypeRadios = document.querySelectorAll('input[name="alert-type"]');
        alertTypeRadios.forEach(radio => {
            radio.addEventListener('change', toggleAlertOptions);
        });
        
        // Inițial, activează opțiunile corespunzătoare
        toggleAlertOptions();
    }
}

// Controlează afișarea opțiunilor de alertă în funcție de tipul selectat
function toggleAlertOptions() {
    const selectedType = document.querySelector('input[name="alert-type"]:checked').value;
    
    // Activează/dezactivează câmpurile corespunzătoare
    document.getElementById('alertPercent').disabled = (selectedType !== 'percent');
    document.getElementById('alertAmount').disabled = (selectedType !== 'amount');
    document.getElementById('alertTarget').disabled = (selectedType !== 'target');
}

// Închide modal setări alertă
function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Salvează setările alertei
function saveAlertSettings(productId) {
    // Obține setările din formular
    const alertType = document.querySelector('input[name="alert-type"]:checked').value;
    const alertSettings = {
        type: alertType,
        productId: productId,
        createdAt: Date.now(),
        currentPrice: getCurrentPrice(productId),
        notifyEmail: document.querySelector('input[name="notify-email"]').checked,
        notifyPush: document.querySelector('input[name="notify-push"]').checked,
        notifySms: document.querySelector('input[name="notify-sms"]').checked,
        duration: document.getElementById('alertDuration').value
    };
    
    // Adaugă parametrii specifici tipului de alertă
    switch (alertType) {
        case 'percent':
            alertSettings.percent = parseInt(document.getElementById('alertPercent').value);
            break;
        case 'amount':
            alertSettings.amount = parseInt(document.getElementById('alertAmount').value);
            break;
        case 'target':
            alertSettings.target = parseInt(document.getElementById('alertTarget').value);
            break;
    }
    
    // Calculează data de expirare
    if (alertSettings.duration !== 'unlimited') {
        const days = parseInt(alertSettings.duration);
        alertSettings.expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
    }
    
    // Salvează în localStorage
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    alerts[productId] = alertSettings;
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    
    // În aplicația reală, aici s-ar trimite datele către server
    sendAlertToServer(alertSettings);
}

// Simulează trimiterea alertei către server
function sendAlertToServer(alertSettings) {
    console.log('Alertă salvată pe server:', alertSettings);
    // Aici ar fi un fetch() către API-ul serverului
}

// Încarcă setările salvate anterior pentru alertă
function loadSavedAlertSettings(productId) {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    const savedAlert = alerts[productId];
    
    if (savedAlert) {
        // Setează tipul alertei
        const radioButton = document.querySelector(`input[name="alert-type"][value="${savedAlert.type}"]`);
        if (radioButton) radioButton.checked = true;
        
        // Setează valori specifice
        switch (savedAlert.type) {
            case 'percent':
                document.getElementById('alertPercent').value = savedAlert.percent;
                break;
            case 'amount':
                document.getElementById('alertAmount').value = savedAlert.amount;
                break;
            case 'target':
                document.getElementById('alertTarget').value = savedAlert.target;
                break;
        }
        
        // Setează metodele de notificare
        document.querySelector('input[name="notify-email"]').checked = savedAlert.notifyEmail;
        document.querySelector('input[name="notify-push"]').checked = savedAlert.notifyPush;
        document.querySelector('input[name="notify-sms"]').checked = savedAlert.notifySms;
        
        // Setează durata
        document.getElementById('alertDuration').value = savedAlert.duration;
        
        // Activează/dezactivează câmpuri
        toggleAlertOptions();
    }
}

// Dezactivează o alertă de preț
function deactivatePriceAlert(productId) {
    // Șterge alerta din localStorage
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    if (alerts[productId]) {
        delete alerts[productId];
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
        
        // În aplicația reală, aici s-ar trimite o cerere către server
        console.log(`Alertă dezactivată pentru produsul ${productId}`);
        
        showNotification(`Alerta de preț a fost dezactivată`, 'info');
    }
}

// Actualizează starea vizuală a butonului de alertă
function updateAlertToggleState(toggleButton, isActive) {
    if (isActive) {
        toggleButton.classList.add('active');
        toggleButton.setAttribute('aria-label', 'Dezactivează alerta de preț');
        toggleButton.innerHTML = '<i class="fas fa-bell"></i>';
        toggleButton.nextElementSibling.textContent = 'Alertă activă';
    } else {
        toggleButton.classList.remove('active');
        toggleButton.setAttribute('aria-label', 'Activează alerta de preț');
        toggleButton.innerHTML = '<i class="far fa-bell"></i>';
        toggleButton.nextElementSibling.textContent = 'Alertă preț';
    }
}

// Inițializează starea butoanelor de alertă din localStorage
function initializeAlertStates() {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    
    // Pentru fiecare element din wishlist, verifică dacă există o alertă
    document.querySelectorAll('.wishlist-item').forEach(item => {
        const productId = item.getAttribute('data-product-id');
        const alertToggle = item.querySelector('.price-alert-toggle');
        
        if (productId && alertToggle) {
            const hasAlert = !!alerts[productId];
            updateAlertToggleState(alertToggle, hasAlert);
            
            // Verifică și dacă este un produs cu preț scăzut
            checkPriceDrop(productId, item);
        }
    });
}

// Verifică dacă prețul a scăzut pentru un produs
function checkPriceDrop(productId, itemElement) {
    // Obține istoricul de prețuri
    const priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '{}');
    const productHistory = priceHistory[productId];
    
    if (productHistory && productHistory.length >= 2) {
        // Compară prețul curent cu cel anterior
        const currentPrice = parseFloat(getCurrentPrice(productId));
        const previousPrice = parseFloat(productHistory[productHistory.length - 2].price);
        
        if (currentPrice < previousPrice) {
            const priceDifference = previousPrice - currentPrice;
            const percentageDrop = Math.round((priceDifference / previousPrice) * 100);
            
            // Marchează vizual produsul ca având o scădere de preț
            const card = itemElement.querySelector('.product-card');
            if (card && !card.classList.contains('has-price-drop')) {
                card.classList.add('has-price-drop');
                
                // Adaugă badge-ul de scădere de preț
                const priceDropAlert = document.createElement('span');
                priceDropAlert.className = 'price-drop-alert';
                priceDropAlert.textContent = `Prețul a scăzut cu ${priceDifference.toFixed(0)} lei!`;
                
                const alertStatus = itemElement.querySelector('.alert-status');
                if (alertStatus && alertStatus.nextElementSibling !== priceDropAlert) {
                    alertStatus.insertAdjacentElement('afterend', priceDropAlert);
                }
            }
        }
    }
}

// Obține prețul curent al unui produs
function getCurrentPrice(productId) {
    const wishlistItem = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
    if (wishlistItem) {
        const priceElement = wishlistItem.querySelector('.current-price');
        if (priceElement) {
            // Extrage valoarea numerică din text (de ex. "500 lei" -> 500)
            return parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
        }
    }
    return 0;
}

// Inițializare butoane de adăugare în coș
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.wishlist-item .add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wishlistItem = this.closest('.wishlist-item');
            const productCard = this.closest('.product-card');
            const productId = wishlistItem.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Adaugă produsul în coș
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Afișează notificare
            showNotification(`${productName} a fost adăugat în coș`, 'success');
        });
    });
}

// Adaugă un produs în coș
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verifică dacă produsul există deja în coș
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizează contorul din header
    updateCartCount(cart.length);
}

// Actualizează contorul de produse din coș
function updateCartCount(count) {
    const cartBadge = document.querySelector('.cart-toggle .badge');
    if (cartBadge) {
        cartBadge.textContent = count;
    }
}

// Inițializare butoane de eliminare
function initRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-from-wishlist');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wishlistItem = this.closest('.wishlist-item');
            const productId = wishlistItem.getAttribute('data-product-id');
            const productName = wishlistItem.querySelector('.product-name').textContent;
            
            // Animație de eliminare
            wishlistItem.style.opacity = '0';
            wishlistItem.style.transform = 'scale(0.9)';
            
            // Eliminare după terminarea animației
            setTimeout(() => {
                wishlistItem.remove();
                
                // Elimină produsul din localStorage
                removeFromWishlist(productId);
                
                // Verifică dacă mai există produse
                const remainingItems = document.querySelectorAll('.wishlist-item');
                updateWishlistCount(remainingItems.length);
                
                if (remainingItems.length === 0) {
                    showEmptyState();
                }
                
                // Afișează notificare
                showNotification(`${productName} a fost eliminat din favorite`, 'info');
            }, 300);
        });
    });
}

// Elimină un produs din wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    const index = wishlist.indexOf(productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    // Elimină și alerta de preț asociată
    deactivatePriceAlert(productId);
}

// Actualizează contorul de produse favorite
function updateWishlistCount(count) {
    const wishlistCount = document.querySelector('.wishlist-count');
    const wishlistBadge = document.querySelector('.wishlist-toggle .badge');
    
    if (wishlistCount) {
        wishlistCount.textContent = `${count} produse`;
    }
    
    if (wishlistBadge) {
        wishlistBadge.textContent = count;
    }
}

// Afișează starea de listă goală
function showEmptyState() {
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const recommendationsSection = document.querySelector('.recommendations');
    const wishlistControls = document.querySelector('.wishlist-controls');
    
    if (emptyWishlist && wishlistGrid && recommendationsSection && wishlistControls) {
        emptyWishlist.style.display = 'block';
        wishlistGrid.style.display = 'none';
        wishlistControls.style.display = 'none';
        recommendationsSection.style.display = 'none';
    }
}

// Inițializare sortare
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const wishlistItems = Array.from(document.querySelectorAll('.wishlist-item'));
            const wishlistGrid = document.querySelector('.wishlist-grid');
            
            if (wishlistItems.length > 0 && wishlistGrid) {
                // Sortează produsele
                wishlistItems.sort((a, b) => {
                    switch (sortValue) {
                        case 'price-asc':
                            return getPriceValue(a) - getPriceValue(b);
                        case 'price-desc':
                            return getPriceValue(b) - getPriceValue(a);
                        case 'name-asc':
                            return getProductName(a).localeCompare(getProductName(b));
                        case 'date-desc':
                        default:
                            return 0; // Păstrează ordinea inițială
                    }
                });
                
                // Reconstruiește lista
                wishlistGrid.innerHTML = '';
                wishlistItems.forEach(item => {
                    wishlistGrid.appendChild(item);
                });
            }
        });
    }
}

// Obține valoarea numerică a prețului
function getPriceValue(item) {
    const priceElement = item.querySelector('.current-price');
    if (priceElement) {
        return parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 0;
    }
    return 0;
}

// Obține numele produsului
function getProductName(item) {
    const nameElement = item.querySelector('.product-name');
    return nameElement ? nameElement.textContent : '';
}

// Inițializează acțiunile globale
function initGlobalActions() {
    const addAllButton = document.querySelector('.add-all-to-cart');
    const clearWishlistButton = document.querySelector('.clear-wishlist');
    
    if (addAllButton) {
        addAllButton.addEventListener('click', function() {
            const wishlistItems = document.querySelectorAll('.wishlist-item');
            
            if (wishlistItems.length > 0) {
                wishlistItems.forEach(item => {
                    const productId = item.getAttribute('data-product-id');
                    const productName = item.querySelector('.product-name').textContent;
                    const productPrice = item.querySelector('.current-price').textContent;
                    
                    // Adaugă în coș
                    addToCart({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                });
                
                showNotification('Toate produsele au fost adăugate în coș', 'success');
            }
        });
    }
    
    if (clearWishlistButton) {
        clearWishlistButton.addEventListener('click', function() {
            const wishlistItems = document.querySelectorAll('.wishlist-item');
            
            if (wishlistItems.length > 0) {
                // Confirmă acțiunea
                if (confirm('Ești sigur că vrei să golești lista de favorite?')) {
                    // Elimină toate produsele cu animație
                    wishlistItems.forEach((item, index) => {
                        const productId = item.getAttribute('data-product-id');
                        
                        // Animație de eliminare cu delay progresiv
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.9)';
                            
                            setTimeout(() => {
                                item.remove();
                                
                                // Elimină din localStorage
                                removeFromWishlist(productId);
                                
                                // Verifică dacă a fost ultimul produs
                                if (index === wishlistItems.length - 1) {
                                    showEmptyState();
                                    updateWishlistCount(0);
                                }
                            }, 300);
                        }, index * 100);
                    });
                    
                    // Afișează notificare
                    showNotification('Lista de favorite a fost golită', 'info');
                }
            }
        });
    }
}

// Implementare istoricul de prețuri
function initPriceHistory() {
    // Simularea unui istoric de prețuri pentru demo
    // În aplicația reală, aceste date ar veni de la server
    const simulatePriceHistory = () => {
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000; // o zi în milisecunde
        
        // Creează un istoric de prețuri pentru fiecare produs
        const priceHistories = {};
        
        document.querySelectorAll('.wishlist-item').forEach(item => {
            const productId = item.getAttribute('data-product-id');
            const currentPrice = getCurrentPrice(productId);
            
            // Generează un istoric de prețuri pentru ultimele 30 de zile
            const history = [];
            let price = currentPrice;
            
            // Produsele cu id 4 au o scădere de preț recentă
            const hasPriceDrop = productId === '4';
            
            for (let i = 30; i >= 0; i--) {
                // Pentru produsele cu scădere de preț, simulăm o scădere la 5 zile în urmă
                if (hasPriceDrop && i === 5) {
                    const oldPrice = Math.round(price * 1.15); // creștere cu 15%
                    history.push({
                        date: now - (i * day),
                        price: oldPrice
                    });
                } else {
                    // Variație mică aleatorie pentru celelalte zile
                    const variation = 1 + (Math.random() * 0.06 - 0.03); // ±3%
                    if (i > 5 || !hasPriceDrop) {
                        price = Math.round(price * variation);
                    }
                    
                    history.push({
                        date: now - (i * day),
                        price: price
                    });
                }
            }
            
            priceHistories[productId] = history;
        });
        
        // Salvează în localStorage
        localStorage.setItem('priceHistory', JSON.stringify(priceHistories));
        
        return priceHistories;
    };
    
    // Verifică dacă există deja un istoric de prețuri în localStorage
    let priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '{}');
    
    // Dacă nu există, generează unul
    if (Object.keys(priceHistory).length === 0) {
        priceHistory = simulatePriceHistory();
    }
    
    // Verifică alertele active și procesează notificările
    processAlerts(priceHistory);
}

// Procesare alerte de preț
function processAlerts(priceHistory) {
    // Obține alertele active
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    
    // Pentru fiecare alertă, verifică dacă trebuie declanșată
    Object.keys(alerts).forEach(productId => {
        const alert = alerts[productId];
        const productHistory = priceHistory[productId];
        
        // Verifică dacă alerta nu a expirat
        if (alert.expiresAt && alert.expiresAt < Date.now()) {
            // Alertă expirată, o ștergem
            delete alerts[productId];
            console.log(`Alertă expirată pentru produsul ${productId}`);
            return;
        }
        
        // Verifică dacă există istoric de prețuri pentru acest produs
        if (productHistory && productHistory.length >= 2) {
            const latestPrice = productHistory[productHistory.length - 1].price;
            const creationPrice = alert.currentPrice;
            
            // Verifică dacă prețul a scăzut conform criteriilor alertei
            let shouldTrigger = false;
            let message = '';
            
            if (latestPrice < creationPrice) {
                const priceDiff = creationPrice - latestPrice;
                const percentDiff = Math.round((priceDiff / creationPrice) * 100);
                
                switch (alert.type) {
                    case 'any':
                        shouldTrigger = true;
                        message = `Prețul a scăzut cu ${priceDiff} lei (${percentDiff}%)`;
                        break;
                    case 'percent':
                        if (percentDiff >= alert.percent) {
                            shouldTrigger = true;
                            message = `Prețul a scăzut cu ${percentDiff}%, mai mult decât cele ${alert.percent}% setate`;
                        }
                        break;
                    case 'amount':
                        if (priceDiff >= alert.amount) {
                            shouldTrigger = true;
                            message = `Prețul a scăzut cu ${priceDiff} lei, mai mult decât cei ${alert.amount} lei setați`;
                        }
                        break;
                    case 'target':
                        if (latestPrice <= alert.target) {
                            shouldTrigger = true;
                            message = `Prețul a ajuns la ${latestPrice} lei, sub prețul țintă de ${alert.target} lei`;
                        }
                        break;
                }
                
                // Declanșează alerta dacă este cazul
                if (shouldTrigger) {
                    triggerPriceAlert(productId, message);
                    
                    // În aplicația reală, aici s-ar putea trimite notificări prin email, SMS sau push
                    console.log(`Alertă declanșată pentru produsul ${productId}: ${message}`);
                }
            }
        }
    });
    
    // Salvează alertele actualizate (cele expirate au fost eliminate)
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
}

// Declanșează o alertă de preț
function triggerPriceAlert(productId, message) {
    // În aplicația reală, aici s-ar trimite notificări prin email, push, etc.
    // Pentru demo, doar afișăm un mesaj în consolă
    console.log(`Notificare pentru produsul ${productId}: ${message}`);
    
    // Marchează vizual produsul
    const wishlistItem = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
    if (wishlistItem) {
        const productCard = wishlistItem.querySelector('.product-card');
        if (productCard) {
            productCard.classList.add('has-price-drop');
            
            // Adaugă badge-ul de scădere de preț dacă nu există deja
            if (!wishlistItem.querySelector('.price-drop-alert')) {
                const alertStatus = wishlistItem.querySelector('.alert-status');
                if (alertStatus) {
                    const priceDropAlert = document.createElement('span');
                    priceDropAlert.className = 'price-drop-alert';
                    priceDropAlert.textContent = message;
                    alertStatus.insertAdjacentElement('afterend', priceDropAlert);
                }
            }
        }
    }
}

// Afișare notificări
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
    
    // Ascunde notificarea după 3 secunde
    setTimeout(() => {
        notification.classList.remove('active');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}