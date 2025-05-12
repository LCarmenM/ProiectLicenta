// wishlist.js - JavaScript actualizat pentru pagina de favorite

document.addEventListener('DOMContentLoaded', function() {
    // Inițializare funcționalitate carduri de produse
    initProductCards();
    
    // Inițializare funcționalitate specifică wishlist
    initWishlistSpecific();
    
    // Inițializare sortare
    initSorting();
    
    // Inițializare acțiuni globale
    initGlobalActions();
    
    // Inițializare modal alertă
    initAlertModal();
});

function initWishlistSpecific() {
    // Butonul de eliminare din wishlist (icon X)
    const removeButtons = document.querySelectorAll('.remove-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-name').textContent;
            
            // Animație de eliminare
            productCard.style.opacity = '0';
            productCard.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                productCard.remove();
                
                // Verifică dacă mai există produse
                const remainingItems = document.querySelectorAll('.wishlist-product');
                updateWishlistCount(remainingItems.length);
                
                if (remainingItems.length === 0) {
                    showEmptyState();
                }
                
                showNotification(`${productName} a fost eliminat din favorite`, 'info');
            }, 300);
        });
    });
    
    // Butoanele de alertă de preț
    const priceAlertToggles = document.querySelectorAll('.price-alert-toggle');
    priceAlertToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            if (this.classList.contains('active')) {
                // Dezactivare alertă
                this.classList.remove('active');
                this.innerHTML = '<i class="far fa-bell"></i>';
                this.nextElementSibling.textContent = 'Alertă preț';
                showNotification('Alerta de preț a fost dezactivată', 'info');
            } else {
                // Deschide modal pentru setări alertă
                openAlertModal(productId);
            }
        });
    });
}

function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const wishlistProducts = Array.from(document.querySelectorAll('.wishlist-product'));
            const wishlistGrid = document.querySelector('.wishlist-grid');
            
            if (wishlistProducts.length > 0 && wishlistGrid) {
                // Sortează produsele
                wishlistProducts.sort((a, b) => {
                    switch (sortValue) {
                        case 'price-asc':
                            return getPriceValue(a) - getPriceValue(b);
                        case 'price-desc':
                            return getPriceValue(b) - getPriceValue(a);
                        case 'name-asc':
                            return getProductName(a).localeCompare(getProductName(b));
                        case 'date-desc':
                        default:
                            return 0;
                    }
                });
                
                // Reconstruiește grid-ul
                wishlistGrid.innerHTML = '';
                wishlistProducts.forEach(product => {
                    wishlistGrid.appendChild(product);
                });
            }
        });
    }
}

function initGlobalActions() {
    const addAllButton = document.querySelector('.add-all-to-cart');
    const clearWishlistButton = document.querySelector('.clear-wishlist');
    
    if (addAllButton) {
        addAllButton.addEventListener('click', function() {
            const wishlistProducts = document.querySelectorAll('.wishlist-product');
            
            if (wishlistProducts.length > 0) {
                wishlistProducts.forEach(product => {
                    const productName = product.querySelector('.product-name').textContent;
                    // Simulează adăugarea în coș
                    updateCartCount();
                });
                
                showNotification('Toate produsele au fost adăugate în coș', 'success');
            }
        });
    }
    
    if (clearWishlistButton) {
        clearWishlistButton.addEventListener('click', function() {
            const wishlistProducts = document.querySelectorAll('.wishlist-product');
            
            if (wishlistProducts.length > 0) {
                if (confirm('Ești sigur că vrei să golești lista de favorite?')) {
                    wishlistProducts.forEach((product, index) => {
                        setTimeout(() => {
                            product.style.opacity = '0';
                            product.style.transform = 'scale(0.9)';
                            
                            setTimeout(() => {
                                product.remove();
                                
                                if (index === wishlistProducts.length - 1) {
                                    showEmptyState();
                                    updateWishlistCount(0);
                                }
                            }, 300);
                        }, index * 100);
                    });
                    
                    showNotification('Lista de favorite a fost golită', 'info');
                }
            }
        });
    }
}

function initAlertModal() {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-alert');
    const saveBtn = document.querySelector('.save-alert');
    
    if (modal && overlay) {
        if (closeBtn) {
            closeBtn.addEventListener('click', closeAlertModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAlertModal);
        }
        
        overlay.addEventListener('click', closeAlertModal);
        
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const productId = modal.getAttribute('data-product-id');
                saveAlertSettings(productId);
                closeAlertModal();
                
                // Actualizează UI
                const alertToggle = document.querySelector(`.product-card[data-product-id="${productId}"] .price-alert-toggle`);
                if (alertToggle) {
                    alertToggle.classList.add('active');
                    alertToggle.innerHTML = '<i class="fas fa-bell"></i>';
                    alertToggle.nextElementSibling.textContent = 'Alertă activă';
                }
                
                showNotification('Alerta de preț a fost activată', 'success');
            });
        }
    }
}

// Funcții helper
function getPriceValue(element) {
    const priceElement = element.querySelector('.current-price');
    if (priceElement) {
        return parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 0;
    }
    return 0;
}

function getProductName(element) {
    const nameElement = element.querySelector('.product-name');
    return nameElement ? nameElement.textContent : '';
}

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

function showEmptyState() {
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const wishlistControls = document.querySelector('.wishlist-controls');
    const recommendations = document.querySelector('.recommendations');
    
    if (emptyWishlist && wishlistGrid && wishlistControls) {
        emptyWishlist.style.display = 'block';
        wishlistGrid.style.display = 'none';
        wishlistControls.style.display = 'none';
        if (recommendations) {
            recommendations.style.display = 'none';
        }
    }
}

function openAlertModal(productId) {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    
    if (modal && overlay && productCard) {
        // Populează modal cu datele produsului
        const productImage = productCard.querySelector('.product-image img').src;
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        const modalImage = document.getElementById('alertProductImage');
        const modalName = document.getElementById('alertProductName');
        const modalPrice = document.getElementById('alertProductPrice');
        
        if (modalImage) modalImage.src = productImage;
        if (modalName) modalName.textContent = productName;
        if (modalPrice) modalPrice.textContent = productPrice;
        
        // Setează ID-ul produsului în modal
        modal.setAttribute('data-product-id', productId);
        
        // Afișează modal
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    const overlay = document.getElementById('alertModalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function saveAlertSettings(productId) {
    // Aici puneți logica pentru salvarea setărilor alertei
    console.log(`Salvare setări alertă pentru produsul ${productId}`);
    // În aplicația reală, ar trimite date către server
}

// Funcție pentru afișarea notificărilor (reutilizată din product-card.js)
function showNotification(message, type) {
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
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    setTimeout(() => {
        notification.classList.remove('active');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Funcție pentru actualizarea contorului coșului
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-toggle .badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
    }
}