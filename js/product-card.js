// product-card.js - Funcționalități unificate pentru toate cardurile de produse

document.addEventListener('DOMContentLoaded', function() {
    // Inițializare funcționalități pentru product cards
    initProductCards();
    
    // Observer pentru carduri adăugate dinamic
    setupDynamicCardObserver();
});

// Funcție principală de inițializare
function initProductCards() {
    // Selectăm toate cardurile de produse din pagină
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Inițializare butoane pentru fiecare card
        initWishlistButton(card);
        initAddToCartButton(card);
        initColorSelection(card);
        initQuickViewButton(card);
        initProductClick(card);
    });
}

// Inițializare buton wishlist
function initWishlistButton(card) {
    const wishlistBtn = card.querySelector('.wishlist-btn');
    if (!wishlistBtn) return;
    
    wishlistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const icon = this.querySelector('i');
        const productId = card.getAttribute('data-product-id');
        const productName = card.querySelector('.product-name').textContent;
        
        if (this.classList.contains('remove-wishlist')) {
            // Pentru carduri din wishlist
            removeFromWishlist(card, productId, productName);
        } else {
            // Pentru toggle wishlist normal
            toggleWishlist(icon, productId, productName);
        }
    });
}

// Toggle wishlist
function toggleWishlist(icon, productId, productName) {
    if (icon.classList.contains('far')) {
        // Adaugă la favorite
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification(`${productName} a fost adăugat la favorite`, 'success');
        updateWishlistCount(1);
    } else {
        // Elimină de la favorite
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification(`${productName} a fost eliminat de la favorite`, 'info');
        updateWishlistCount(-1);
    }
}

// Elimină din wishlist (pentru pagina wishlist)
function removeFromWishlist(card, productId, productName) {
    // Animație de eliminare
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        card.remove();
        
        // Verifică dacă mai sunt produse în wishlist
        const remainingCards = document.querySelectorAll('.wishlist-product');
        updateWishlistCount(-1, remainingCards.length);
        
        if (remainingCards.length === 0) {
            showEmptyWishlistState();
        }
        
        showNotification(`${productName} a fost eliminat din favorite`, 'info');
    }, 300);
}

// Inițializare buton adăugare în coș
function initAddToCartButton(card) {
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const productName = card.querySelector('.product-name').textContent;
        const productPrice = card.querySelector('.current-price').textContent;
        const selectedColor = card.querySelector('.color-dot.selected');
        
        // Animație pentru buton
        this.classList.add('adding');
        setTimeout(() => {
            this.classList.remove('adding');
        }, 300);
        
        // Adaugă produsul în coș
        addToCart({
            name: productName,
            price: productPrice,
            color: selectedColor ? selectedColor.style.backgroundColor : null
        });
        
        showNotification(`${productName} a fost adăugat în coș`, 'success');
        updateCartCount(1);
    });
}

// Inițializare selecție culori
function initColorSelection(card) {
    const colorDots = card.querySelectorAll('.color-dot');
    
    colorDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Deselectează toate culorile
            colorDots.forEach(d => d.classList.remove('selected'));
            
            // Selectează culoarea curentă
            this.classList.add('selected');
        });
    });
}

// Inițializare quick view
function initQuickViewButton(card) {
    const quickViewBtn = card.querySelector('.quick-view-btn');
    if (!quickViewBtn) return;
    
    quickViewBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const productId = card.getAttribute('data-product-id');
        openQuickView(productId);
    });
}

// Inițializare click pe card
function initProductClick(card) {
    card.addEventListener('click', function(e) {
        // Nu naviga dacă s-a făcut click pe butoane
        if (e.target.closest('.wishlist-btn') || 
            e.target.closest('.add-to-cart-btn') || 
            e.target.closest('.color-dot') ||
            e.target.closest('.quick-view-btn')) {
            return;
        }
        
        // Navighează la pagina produsului
        const productId = this.getAttribute('data-product-id');
        window.location.href = `product.html?id=${productId}`;
    });
}

// Funcții helper

// Afișare notificări
function showNotification(message, type = 'info') {
    // Elimină notificarea existentă
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Creează notificare nouă
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animație de intrare
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Buton de închidere
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-închidere după 3 secunde
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Actualizare contor wishlist
function updateWishlistCount(change, newTotal = null) {
    const wishlistBadge = document.querySelector('.wishlist-toggle .badge');
    if (!wishlistBadge) return;
    
    if (newTotal !== null) {
        wishlistBadge.textContent = newTotal;
    } else {
        let currentCount = parseInt(wishlistBadge.textContent) || 0;
        wishlistBadge.textContent = Math.max(0, currentCount + change);
    }
}

// Actualizare contor coș
function updateCartCount(change) {
    const cartBadge = document.querySelector('.cart-toggle .badge');
    if (!cartBadge) return;
    
    let currentCount = parseInt(cartBadge.textContent) || 0;
    cartBadge.textContent = currentCount + change;
}

// Afișare stare goală pentru wishlist
function showEmptyWishlistState() {
    const emptyState = document.querySelector('.empty-wishlist');
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const wishlistControls = document.querySelector('.wishlist-controls');
    
    if (emptyState) {
        emptyState.style.display = 'block';
    }
    if (wishlistGrid) {
        wishlistGrid.style.display = 'none';
    }
    if (wishlistControls) {
        wishlistControls.style.display = 'none';
    }
}

// Adaugă produs în coș
function addToCart(product) {
    // Obține coșul curent din localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Adaugă produsul
    cart.push({
        ...product,
        id: Date.now(), // ID temporar
        quantity: 1
    });
    
    // Salvează înapoi în localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Deschide quick view
function openQuickView(productId) {
    // Aici ar fi logica pentru deschiderea modalului quick view
    // Pentru demo, doar afișăm o notificare
    showNotification('Quick view pentru produsul #' + productId, 'info');
}

// Observer pentru carduri adăugate dinamic
function setupDynamicCardObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Verifică dacă este un product card
                    if (node.classList && node.classList.contains('product-card')) {
                        initWishlistButton(node);
                        initAddToCartButton(node);
                        initColorSelection(node);
                        initQuickViewButton(node);
                        initProductClick(node);
                    }
                    
                    // Verifică dacă conține product cards
                    const cards = node.querySelectorAll('.product-card');
                    cards.forEach(card => {
                        initWishlistButton(card);
                        initAddToCartButton(card);
                        initColorSelection(card);
                        initQuickViewButton(card);
                        initProductClick(card);
                    });
                }
            });
        });
    });
    
    // Observă schimbările în body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Funcții suplimentare pentru integrare

// Sincronizare wishlist cu backend
function syncWishlistWithBackend() {
    // Simulare API call
    const wishlistItems = document.querySelectorAll('.wishlist-product');
    const wishlistData = [];
    
    wishlistItems.forEach(item => {
        wishlistData.push({
            id: item.getAttribute('data-product-id'),
            name: item.querySelector('.product-name').textContent,
            price: item.querySelector('.current-price').textContent
        });
    });
    
    // Aici ar fi requestul către server
    console.log('Sincronizare wishlist:', wishlistData);
}

// Validare disponibilitate produs
function checkProductAvailability(productId) {
    // Simulare verificare stoc
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.random() > 0.2); // 80% șansă să fie disponibil
        }, 500);
    });
}

// Export funcții pentru utilizare în alte module
window.ProductCardManager = {
    init: initProductCards,
    showNotification: showNotification,
    updateWishlistCount: updateWishlistCount,
    updateCartCount: updateCartCount,
    syncWishlist: syncWishlistWithBackend
};