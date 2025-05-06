document.addEventListener('DOMContentLoaded', function() {
    // Inițializare coș de cumpărături
    initCart();
    
    // Actualizare cantități
    initQuantityControls();
    
    // Eliminare produse
    initRemoveButtons();
    
    // Actualizare coș
    initUpdateCart();
    
    // Aplicare cupon
    initCouponCode();
});

// Inițializare coș
function initCart() {
    // Verifică dacă există produse în coș
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCart = document.querySelector('.empty-cart');
    const cartPage = document.querySelector('.cart-page');
    
    if (cartItems.length === 0) {
        // Afișează mesajul de coș gol
        if (emptyCart && cartPage) {
            emptyCart.style.display = 'block';
            cartPage.style.display = 'none';
        }
    }
    
    // Calculează subtotalul inițial
    updateCartTotals();
}

// Inițializare controale cantitate
function initQuantityControls() {
    const minusBtns = document.querySelectorAll('.quantity-btn.minus');
    const plusBtns = document.querySelectorAll('.quantity-btn.plus');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    // Butoane minus
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = value - 1;
                updateProductSubtotal(this.closest('.cart-item'));
                updateCartTotals();
            }
        });
    });
    
    // Butoane plus
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            const max = parseInt(input.getAttribute('max'));
            
            if (value < max) {
                input.value = value + 1;
                updateProductSubtotal(this.closest('.cart-item'));
                updateCartTotals();
            }
        });
    });
    
    // Input-uri cantitate (modificare manuală)
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));
            
            if (isNaN(value) || value < min) {
                this.value = min;
                value = min;
            } else if (value > max) {
                this.value = max;
                value = max;
            }
            
            updateProductSubtotal(this.closest('.cart-item'));
            updateCartTotals();
        });
    });
}

// Inițializare butoane de eliminare
function initRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            
            // Animație de eliminare
            cartItem.style.opacity = '0';
            cartItem.style.height = '0';
            cartItem.style.overflow = 'hidden';
            
            // Eliminare după terminarea animației
            setTimeout(() => {
                cartItem.remove();
                updateCartTotals();
                
                // Verifică dacă mai există produse în coș
                const remainingItems = document.querySelectorAll('.cart-item');
                
                if (remainingItems.length === 0) {
                    const emptyCart = document.querySelector('.empty-cart');
                    const cartPage = document.querySelector('.cart-page');
                    
                    if (emptyCart && cartPage) {
                        emptyCart.style.display = 'block';
                        cartPage.style.display = 'none';
                    }
                }
            }, 300);
        });
    });
}

// Inițializare buton actualizare c
// Inițializare buton actualizare coș
function initUpdateCart() {
    const updateButton = document.querySelector('.update-cart');
    
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            // În mod normal, aici ar fi un apel la server pentru actualizarea coșului
            // Pentru acest exemplu, vom simula un delay și vom afișa un mesaj de confirmare
            
            updateButton.disabled = true;
            updateButton.textContent = 'Se actualizează...';
            
            setTimeout(() => {
                updateButton.disabled = false;
                updateButton.textContent = 'Actualizează coșul';
                
                // Afișează un mesaj de confirmare
                showNotification('Coșul a fost actualizat cu succes!', 'success');
            }, 1000);
        });
    }
}

// Inițializare cod de reducere
function initCouponCode() {
    const couponForm = document.querySelector('.coupon');
    
    if (couponForm) {
        const applyButton = couponForm.querySelector('.apply-coupon');
        const couponInput = couponForm.querySelector('input');
        
        applyButton.addEventListener('click', function() {
            const couponCode = couponInput.value.trim();
            
            if (couponCode === '') {
                showNotification('Te rugăm să introduci un cod de reducere.', 'error');
                return;
            }
            
            // În mod normal, aici ar fi un apel la server pentru validarea codului
            // Pentru acest exemplu, vom accepta doar codul "DYNASTY20"
            
            applyButton.disabled = true;
            applyButton.textContent = 'Se aplică...';
            
            setTimeout(() => {
                applyButton.disabled = false;
                applyButton.textContent = 'Aplică';
                
                if (couponCode.toUpperCase() === 'DYNASTY20') {
                    // Aplică reducerea
                    applyDiscount(20);
                    
                    // Afișează un mesaj de confirmare
                    showNotification('Codul de reducere a fost aplicat cu succes!', 'success');
                } else {
                    // Afișează un mesaj de eroare
                    showNotification('Codul de reducere nu este valid.', 'error');
                }
            }, 1000);
        });
    }
}

// Funcție pentru aplicarea reducerii
function applyDiscount(percentage) {
    const subtotalValue = calculateSubtotal();
    const discount = (subtotalValue * percentage) / 100;
    
    // Actualizează afișarea reducerii
    const discountElement = document.querySelector('.discount-row span:last-child');
    if (discountElement) {
        discountElement.textContent = `-${discount.toFixed(0)} lei`;
    }
    
    // Actualizează totalul
    updateCartTotals(discount);
}

// Funcție pentru actualizarea subtotalului produsului
function updateProductSubtotal(cartItem) {
    const priceElement = cartItem.querySelector('.current-price');
    const quantityInput = cartItem.querySelector('.quantity-input');
    const subtotalElement = cartItem.querySelector('.subtotal');
    
    if (priceElement && quantityInput && subtotalElement) {
        const price = parseFloat(priceElement.textContent);
        const quantity = parseInt(quantityInput.value);
        const subtotal = price * quantity;
        
        subtotalElement.textContent = `${subtotal.toFixed(0)} lei`;
    }
}

// Funcție pentru calcularea subtotalului
function calculateSubtotal() {
    let subtotal = 0;
    const subtotalElements = document.querySelectorAll('.subtotal');
    
    subtotalElements.forEach(element => {
        subtotal += parseFloat(element.textContent);
    });
    
    return subtotal;
}

// Funcție pentru actualizarea totalurilor coșului
function updateCartTotals(discount = 0) {
    const subtotal = calculateSubtotal();
    const subtotalElement = document.querySelector('.subtotal-row span:last-child');
    const totalElement = document.querySelector('.total-row span:last-child');
    
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toFixed(0)} lei`;
    }
    
    if (totalElement) {
        const total = subtotal - discount;
        totalElement.textContent = `${total.toFixed(0)} lei`;
    }
    
    // Actualizează și contorul de produse din header
    updateHeaderCartCount();
}

// Funcție pentru actualizarea contorului de produse din header
function updateHeaderCartCount() {
    const cartBadge = document.querySelector('.cart-toggle .badge');
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartBadge) {
        cartBadge.textContent = cartItems.length;
    }
}

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



    // Add this to cart.js or create a new file and include it after cart.js
document.addEventListener('DOMContentLoaded', function() {
  // CRITICAL: Make sure the drawer is positioned correctly
  // This script should be added AFTER your existing cart.js file
  
  console.log('Drawer fix script loaded');
  
  // Get drawer elements
  const editDrawer = document.getElementById('editProductDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  
  if (!editDrawer || !drawerOverlay) {
    console.error('Drawer elements not found!');
    return;
  }
  
  // Log the current state to debug
  console.log('Edit drawer current position:', editDrawer.style.position);
  console.log('Edit drawer current display:', editDrawer.style.display);
  
  // Force override all styles to ensure correct positioning
  editDrawer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    right: -400px !important;
    width: 400px !important;
    height: 100% !important;
    max-width: 100% !important;
    background-color: white !important;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1) !important;
    z-index: 9999 !important;
    transition: right 0.3s ease !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: auto !important;
  `;
  
  drawerOverlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    z-index: 9998 !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transition: opacity 0.3s ease, visibility 0.3s ease !important;
  `;
  
  // Completely rewrite the event handlers for edit buttons
  const editButtons = document.querySelectorAll('.edit-product-btn');
  
  editButtons.forEach(button => {
    // Remove existing event listeners (if any)
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Edit button clicked');
      
      const cartItem = this.closest('.cart-item');
      const productId = cartItem.getAttribute('data-product-id');
      
      // Load product data
      loadProductDataIntoDrawer(productId, cartItem);
      
      // Show drawer
      console.log('Showing drawer');
      editDrawer.style.right = '0';
      drawerOverlay.style.opacity = '1';
      drawerOverlay.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close drawer handlers
  const closeDrawerBtn = editDrawer.querySelector('.close-drawer');
  const cancelBtn = editDrawer.querySelector('.cancel-edit');
  
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
    });
  }
  
  drawerOverlay.addEventListener('click', function() {
    closeDrawer();
  });
  
  function closeDrawer() {
    console.log('Closing drawer');
    editDrawer.style.right = '-400px';
    drawerOverlay.style.opacity = '0';
    drawerOverlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  }
  
  // Save changes handler
  const saveBtn = editDrawer.querySelector('.save-edit');
  if (saveBtn) {
    saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      saveProductChanges();
      closeDrawer();
    });
  }
  
  // Initialize drawer controls
  initializeDrawerControls();
  
  // Function to load product data into drawer
  function loadProductDataIntoDrawer(productId, cartItem) {
    console.log('Loading product data for ID:', productId);
    
    // Get product details
    const productName = cartItem.querySelector('.product-name').textContent;
    const productImage = cartItem.querySelector('.product-image img').src;
    const productPrice = cartItem.querySelector('.current-price').textContent;
    const productQuantity = cartItem.querySelector('.quantity-input').value;
    const productColor = cartItem.querySelector('.option:nth-child(1) span').textContent;
    const productSize = cartItem.querySelector('.option:nth-child(2) span').textContent;
    
    // Update drawer elements
    const nameEl = editDrawer.querySelector('#editProductName');
    const imageEl = editDrawer.querySelector('#editProductImage');
    const priceEl = editDrawer.querySelector('#editProductPrice');
    const quantityEl = editDrawer.querySelector('.quantity-input');
    
    if (nameEl) nameEl.textContent = productName;
    if (imageEl) {
      imageEl.src = productImage;
      imageEl.alt = productName;
    }
    if (priceEl) priceEl.textContent = productPrice;
    if (quantityEl) quantityEl.value = productQuantity;
    
    // Update color options
    const colorOptions = editDrawer.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      const optionColor = option.getAttribute('data-color').toLowerCase();
      if (optionColor === productColor.toLowerCase()) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    // Update size options
    const sizeOptions = editDrawer.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
      const optionSize = option.getAttribute('data-size');
      if (optionSize === productSize) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    // Store product ID in drawer
    editDrawer.setAttribute('data-product-id', productId);
  }
  
  // Function to save product changes
  function saveProductChanges() {
    console.log('Saving product changes');
    
    const productId = editDrawer.getAttribute('data-product-id');
    const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
    
    if (!cartItem) {
      console.error('Cart item not found with ID:', productId);
      return;
    }
    
    // Get selected options
    const selectedColor = editDrawer.querySelector('.color-option.selected')?.getAttribute('data-color');
    const selectedSize = editDrawer.querySelector('.size-option.selected')?.getAttribute('data-size');
    const selectedQuantity = editDrawer.querySelector('.quantity-input').value;
    
    // Update cart item
    const colorSpan = cartItem.querySelector('.option:nth-child(1) span');
    const sizeSpan = cartItem.querySelector('.option:nth-child(2) span');
    const quantityInput = cartItem.querySelector('.quantity-input');
    
    if (colorSpan) colorSpan.textContent = selectedColor;
    if (sizeSpan) sizeSpan.textContent = selectedSize;
    if (quantityInput) quantityInput.value = selectedQuantity;
    
    // Update subtotal
    if (typeof updateProductSubtotal === 'function') {
      updateProductSubtotal(cartItem);
      updateCartTotals();
    }
    
    // Show notification
    if (typeof showNotification === 'function') {
      showNotification('Produsul a fost actualizat cu succes!', 'success');
    }
  }
  
  // Function to initialize drawer controls
  function initializeDrawerControls() {
    // Quantity controls
    const minusBtn = editDrawer.querySelector('.quantity-btn.minus');
    const plusBtn = editDrawer.querySelector('.quantity-btn.plus');
    const quantityInput = editDrawer.querySelector('.quantity-input');
    
    if (minusBtn && quantityInput) {
      minusBtn.addEventListener('click', function() {
        const value = parseInt(quantityInput.value);
        if (value > 1) {
          quantityInput.value = value - 1;
        }
      });
    }
    
    if (plusBtn && quantityInput) {
      plusBtn.addEventListener('click', function() {
        const value = parseInt(quantityInput.value);
        if (value < 10) {
          quantityInput.value = value + 1;
        }
      });
    }
    
    // Color options
    const colorOptions = editDrawer.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    
    // Size options
    const sizeOptions = editDrawer.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
      option.addEventListener('click', function() {
        sizeOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
  }
  
  // Log that the script has completed initialization
  console.log('Drawer fix script initialized successfully');
});
}

// Adaugă stil CSS pentru notificări (adaugă aceste stiluri în CSS)
/* 
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 350px;
    transform: translateX(100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.notification.active {
    transform: translateX(0);
    opacity: 1;
}

.notification-content {
    padding: 15px 20px;
    background-color: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.notification.success .notification-content {
    border-left: 4px solid var(--color-success);
}

.notification.error .notification-content {
    border-left: 4px solid var(--color-error);
}

.close-notification {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--color-text-light);
    transition: color 0.3s ease;
}

.close-notification:hover {
    color: var(--color-text);
}
*/

