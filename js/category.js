document.addEventListener('DOMContentLoaded', function() {
    // Toggle Mobile Filters
    const filterToggleBtn = document.querySelector('.filter-toggle');
    const mobileFilters = document.querySelector('.mobile-filters');
    const filterOverlay = document.querySelector('.filter-overlay');
    const closeFiltersBtn = document.querySelector('.mobile-filters-close');
    
    if (filterToggleBtn && mobileFilters && filterOverlay && closeFiltersBtn) {
        filterToggleBtn.addEventListener('click', function() {
            mobileFilters.classList.add('active');
            filterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeFiltersBtn.addEventListener('click', function() {
            mobileFilters.classList.remove('active');
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        filterOverlay.addEventListener('click', function() {
            mobileFilters.classList.remove('active');
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Price Range Slider
    const priceRange = document.getElementById('priceRange');
    const minPriceDisplay = document.getElementById('minPrice');
    const maxPriceDisplay = document.getElementById('maxPrice');
    
    if (priceRange && minPriceDisplay && maxPriceDisplay) {
        priceRange.addEventListener('input', function() {
            maxPriceDisplay.textContent = this.value + ' lei';
        });
    }
    
    // Quick View Functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Aici ar urma implementarea modalului de previzualizare rapidă
            // Pentru acest exemplu, doar afișăm un mesaj în consolă
            console.log('Quick view clicked for:', this.closest('.product-card').querySelector('.product-name').textContent);
        });
    });
    
    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Simulăm adăugarea în coș
            console.log('Added to cart:', {
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Afișăm o notificare de confirmare
            showNotification(`${productName} a fost adăugat în coș`, 'success');
        });
    });
    
    // Wishlist Functionality
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Adaugă la favorite
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Produs adăugat la favorite', 'success');
            } else {
                // Elimină de la favorite
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Produs eliminat de la favorite', 'info');
            }
        });
    });
    
    // Function to show notifications
    function showNotification(message, type) {
        // Verificăm dacă există deja o notificare
        const existingNotification = document.querySelector('.notification');
        
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Creăm elementul de notificare
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
        
        // Afișăm notificarea (cu o mică întârziere pentru animație)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Adăugăm funcționalitatea butonului de închidere
        const closeButton = notification.querySelector('.close-notification');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                notification.classList.remove('active');
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Ascundem notificarea după 3 secunde
        setTimeout(() => {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Filter Functionality
    const filterInputs = document.querySelectorAll('.filter-section input[type="checkbox"], .filter-section input[type="radio"]');
    const resetFiltersBtn = document.querySelector('.btn-reset-filters');
    const applyFiltersBtn = document.querySelector('.btn-apply-filters');
    
    // Aplicăm filtrele
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Aici ar urma implementarea reală a filtrării produselor
            // Pentru acest exemplu, doar afișăm un mesaj
            showNotification('Filtrele au fost aplicate', 'success');
        });
    }
    
    // Resetăm filtrele
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            filterInputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                }
            });
            
            // Resetăm slider-ul de preț, dacă există
            if (priceRange) {
                priceRange.value = priceRange.max;
                maxPriceDisplay.textContent = priceRange.max + ' lei';
            }
            
            showNotification('Filtrele au fost resetate', 'info');
        });
    }
});