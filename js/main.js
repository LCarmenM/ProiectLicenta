document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initMobileMenu();
    initSearchOverlay();
    initCartSidebar();
    initQuantitySelectors();
    initProductActions();
    initNotifications();
    initDropdowns();
    updateCartCount();
});

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (menuToggle && mobileMenu && closeMenu && menuOverlay) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            body.classList.add('menu-open');
        });

        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });

        menuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    }

    // Mobile menu dropdowns
    const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
    dropdownToggle.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });
}

// Search Overlay
function initSearchOverlay() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const body = document.body;

    if (searchToggle && searchOverlay && closeSearch) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            body.classList.add('menu-open');
            setTimeout(() => {
                searchOverlay.querySelector('input').focus();
            }, 300);
        });

        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });

        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Cart Sidebar
function initCartSidebar() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if (cartToggle && cartSidebar && closeCart && menuOverlay && continueShopping) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            menuOverlay.classList.add('active');
            body.classList.add('menu-open');
        });

        const closeCartFn = function() {
            cartSidebar.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        };

        closeCart.addEventListener('click', closeCartFn);
        continueShopping.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartFn();
        });

        menuOverlay.addEventListener('click', closeCartFn);
    }
}

// Quantity Selectors
function initQuantitySelectors() {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let currentValue = parseInt(input.value);
            
            if (this.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            } else if (this.classList.contains('plus')) {
                input.value = currentValue + 1;
            }
            
            // Update cart if in cart page
            if (document.querySelector('.cart-page')) {
                updateCartSummary();
            }
        });
    });
}

// Product Actions
function initProductActions() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    const quickViewBtns = document.querySelectorAll('.quick-view');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
            showNotification('Product added to cart!', 'success');
        });
    });
    
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToWishlist(productId);
            showNotification('Product added to wishlist!', 'success');
        });
    });
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            openQuickView(productId);
        });
    });
}

// Notifications
function initNotifications() {
    const notification = document.getElementById('notification');
    const closeNotification = document.querySelector('.close-notification');
    
    if (closeNotification && notification) {
        closeNotification.addEventListener('click', function() {
            notification.classList.remove('active');
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    
    if (notification && notificationMessage) {
        notification.className = 'notification';
        notification.classList.add(type);
        notificationMessage.textContent = message;
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
}

// Dropdowns
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
}

// Cart Functions
function addToCart(productId) {
    // Here you would normally fetch product details from an API
    // For this example, we'll use mock data
    const productData = {
        id: productId,
        name: 'Example Product ' + productId,
        price: 99.99,
        image: 'images/product-' + productId + '.jpg',
        quantity: 1
    };
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex !== -1) {
        // Increment quantity if product already in cart
        cart[existingProductIndex].quantity++;
    } else {
        // Add new product to cart
        cart.push(productData);
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

function updateCartCount() {
    const badge = document.querySelector('.badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If on cart page, update the UI
    if (document.querySelector('.cart-page')) {
        renderCart();
        updateCartSummary();
    }
}

function addToWishlist(productId) {
    // Similar to addToCart, but for wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function openQuickView(productId) {
    // This would typically fetch product details and show a modal
    console.log('Quick view for product ' + productId);
}

// Checkout steps (Hick's Law implementation)
function goToCheckoutStep(step) {
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const checkoutForms = document.querySelectorAll('.checkout-form');
    
    if (checkoutSteps && checkoutForms) {
        // Update the active step
        checkoutSteps.forEach((item, index) => {
            if (index < step) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index === step) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
        
        // Show the active form
        checkoutForms.forEach((form, index) => {
            if (index === step) {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });
    }
}