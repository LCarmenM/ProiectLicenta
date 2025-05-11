document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart functionality
  initCart();

  // Initialize quantity controls
  initQuantityControls();

  // Initialize item removal
  initRemoveItems();

  // Initialize tab switching
  initTabSwitching();

  // Initialize add to cart buttons for recommended products
  initAddToCartButtons();

  // Initialize wishlist buttons
  initWishlistButtons();
});

// Initialize cart functionality
function initCart() {
  // Check if cart is empty
  const cartItems = document.querySelectorAll('.cart-item');
  
  if (cartItems.length === 0) {
      const cartItemsContainer = document.querySelector('.cart-items');
      if (cartItemsContainer) {
          cartItemsContainer.innerHTML = '<div class="empty-cart-message">Coșul tău este gol</div>';
      }
  }

  // Set up edit button functionality
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
      button.addEventListener('click', function() {
          // In a real app, you would open a modal for editing product options
          // For demo purposes, we'll just show an alert
          alert('Funcționalitate de editare va fi implementată în curând!');
      });
  });
}

// Initialize quantity controls
function initQuantityControls() {
  const minusButtons = document.querySelectorAll('.quantity-btn.minus');
  const plusButtons = document.querySelectorAll('.quantity-btn.plus');
  const quantityInputs = document.querySelectorAll('.quantity-input');

  // Decrease quantity
  minusButtons.forEach(button => {
      button.addEventListener('click', function() {
          const input = this.nextElementSibling;
          let value = parseInt(input.value);
          
          if (value > 1) {
              input.value = value - 1;
              updateCartTotals();
          }
      });
  });

  // Increase quantity
  plusButtons.forEach(button => {
      button.addEventListener('click', function() {
          const input = this.previousElementSibling;
          let value = parseInt(input.value);
          const max = parseInt(input.getAttribute('max')) || 10;
          
          if (value < max) {
              input.value = value + 1;
              updateCartTotals();
          }
      });
  });

  // Manual input change
  quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
          let value = parseInt(this.value);
          const min = parseInt(this.getAttribute('min')) || 1;
          const max = parseInt(this.getAttribute('max')) || 10;
          
          if (isNaN(value) || value < min) {
              this.value = min;
          } else if (value > max) {
              this.value = max;
          }
          
          updateCartTotals();
      });
  });
}

// Update cart totals
function updateCartTotals() {
  // In a real app, this would recalculate based on actual quantities and prices
  // For this demo, we'll just keep the existing values
  console.log('Cart totals updated');
}

// Initialize item removal
function initRemoveItems() {
  const removeButtons = document.querySelectorAll('.remove-item');
  
  removeButtons.forEach(button => {
      button.addEventListener('click', function() {
          const cartItem = this.closest('.cart-item');
          
          // Animate removal
          cartItem.style.opacity = '0';
          cartItem.style.height = '0';
          cartItem.style.overflow = 'hidden';
          
          // Remove after animation
          setTimeout(() => {
              cartItem.remove();
              updateCartTotals();
              
              // Check if cart is now empty
              const remainingItems = document.querySelectorAll('.cart-item');
              if (remainingItems.length === 0) {
                  const cartItemsContainer = document.querySelector('.cart-items');
                  if (cartItemsContainer) {
                      cartItemsContainer.innerHTML = '<div class="empty-cart-message">Coșul tău este gol</div>';
                  }
              }
          }, 300);
      });
  });
}

// Initialize tab switching
function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all tabs
          tabButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked tab
          this.classList.add('active');
          
          // Show corresponding content
          const tabId = this.getAttribute('data-tab');
          
          // Hide all tab content
          document.querySelectorAll('.tab-content').forEach(content => {
              content.classList.remove('active');
          });
          
          // Show selected tab content
          document.getElementById(`${tabId}-tab`).classList.add('active');
      });
  });
  
  // Load recently viewed products when that tab is clicked
  const recentViewedTab = document.querySelector('[data-tab="recently-viewed"]');
  if (recentViewedTab) {
      recentViewedTab.addEventListener('click', loadRecentlyViewedProducts);
  }
}

// Load recently viewed products
function loadRecentlyViewedProducts() {
  const tabContent = document.getElementById('recently-viewed-tab');
  
  // Check if content is already loaded
  if (tabContent.children.length > 0) return;
  
  // In a real app, this would load from localStorage or session
  // For demo, we'll add placeholder content
  
  tabContent.innerHTML = `
  <div class="product-grid">
      <!-- Product 1 -->
      <div class="product-card">
          <div class="product-image">
              <img src="images/lant.jpg" alt="Lănțișor">
              <button class="wishlist-btn"><i class="far fa-heart"></i></button>
              <div class="product-rating">
                  <i class="fas fa-star"></i>
                  <span>4.3</span>
              </div>
          </div>
          <div class="product-info">
              <h3 class="product-name">Lănțișor</h3>
              <div class="product-price">
                  <span class="current-price">1,450 lei</span>
              </div>
              <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
          </div>
      </div>
      
      <!-- Product 2 -->
      <div class="product-card">
          <div class="product-image">
              <img src="images/inel.jpg" alt="Inel">
              <button class="wishlist-btn"><i class="far fa-heart"></i></button>
              <div class="product-rating">
                  <i class="fas fa-star"></i>
                  <span>4.5</span>
              </div>
          </div>
          <div class="product-info">
              <h3 class="product-name">Inel</h3>
              <div class="product-price">
                  <span class="current-price">700 lei</span>
              </div>
              <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
          </div>
      </div>
      
      <!-- Product 3 -->
      <div class="product-card">
          <div class="product-image">
              <img src="images/sandale.jpg" alt="Sandale">
              <button class="wishlist-btn"><i class="far fa-heart"></i></button>
              <div class="product-rating">
                  <i class="fas fa-star"></i>
                  <span>4.5</span>
              </div>
          </div>
          <div class="product-info">
              <h3 class="product-name">Sandale</h3>
              <div class="product-price">
                  <span class="current-price">450 lei</span>
              </div>
              <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
          </div>
      </div>
      
      <!-- Product 4 -->
      <div class="product-card">
          <div class="product-image">
              <img src="images/geanta-piele.jpg" alt="Geantă piele">
              <button class="wishlist-btn"><i class="far fa-heart"></i></button>
              <div class="product-rating">
                  <i class="fas fa-star"></i>
                  <span>4.2</span>
              </div>
          </div>
          <div class="product-info">
              <h3 class="product-name">Geantă piele</h3>
              <div class="product-price">
                  <span class="current-price">400 lei</span>
              </div>
              <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
          </div>
      </div>
  </div>
  `;
  
  // Initialize buttons for newly added products
  initAddToCartButtons();
  initWishlistButtons();
}

// Initialize add to cart buttons
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('.product-name').textContent;
          const productPrice = productCard.querySelector('.current-price').textContent;
          
          // In a real app, this would add the product to the cart
          // For this demo, we'll just show a notification
          showNotification(`${productName} a fost adăugat în coș`, 'success');
      });
  });
}

// Initialize wishlist buttons
function initWishlistButtons() {
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  
  wishlistButtons.forEach(button => {
      button.addEventListener('click', function() {
          const icon = this.querySelector('i');
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('.product-name').textContent;
          
          if (icon.classList.contains('far')) {
              // Add to wishlist
              icon.classList.remove('far');
              icon.classList.add('fas');
              showNotification(`${productName} a fost adăugat la favorite`, 'success');
          } else {
              // Remove from wishlist
              icon.classList.remove('fas');
              icon.classList.add('far');
              showNotification(`${productName} a fost eliminat de la favorite`, 'info');
          }
      });
  });
}

// Show notification
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
      <div class="notification-content">
          <span>${message}</span>
          <button class="close-notification">&times;</button>
      </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification with a delay for animation
  setTimeout(() => {
      notification.classList.add('active');
  }, 10);
  
  // Set up close button
  const closeButton = notification.querySelector('.close-notification');
  closeButton.addEventListener('click', () => {
      notification.classList.remove('active');
      
      // Remove from DOM after animation
      setTimeout(() => {
          notification.remove();
      }, 300);
  });
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
      notification.classList.remove('active');
      
      // Remove from DOM after animation
      setTimeout(() => {
          notification.remove();
      }, 300);
  }, 3000);
}


