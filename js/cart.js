document.addEventListener('DOMContentLoaded', function() {
  initCart();
  initQuantityControls();
  initRemoveItems();
  initTabSwitching();
  initAddToCartButtons();
  initWishlistButtons();
});


function initCart() {
  const cartItems = document.querySelectorAll('.cart-item');
  
  if (cartItems.length === 0) {
      const cartItemsContainer = document.querySelector('.cart-items');
      if (cartItemsContainer) {
          cartItemsContainer.innerHTML = '<div class="empty-cart-message">Coșul tău este gol</div>';
      }
  }


  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
      button.addEventListener('click', function() {
          alert('Funcționalitate de editare va fi implementată în curând!');
      });
  });
}


function initQuantityControls() {
  const minusButtons = document.querySelectorAll('.quantity-btn.minus');
  const plusButtons = document.querySelectorAll('.quantity-btn.plus');
  const quantityInputs = document.querySelectorAll('.quantity-input');
  
  
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


function updateCartTotals() {
  console.log('Cart totals updated');
}


function initRemoveItems() {
  const removeButtons = document.querySelectorAll('.remove-item');
  
  removeButtons.forEach(button => {
      button.addEventListener('click', function() {
          const cartItem = this.closest('.cart-item');
     
          cartItem.style.opacity = '0';
          cartItem.style.height = '0';
          cartItem.style.overflow = 'hidden';
          
          setTimeout(() => {
              cartItem.remove();
              updateCartTotals();
              
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

function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
      button.addEventListener('click', function() {
          tabButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          const tabId = this.getAttribute('data-tab');
          document.querySelectorAll('.tab-content').forEach(content => {
              content.classList.remove('active');
          });
          
          document.getElementById(`${tabId}-tab`).classList.add('active');
      });
  });
  const recentViewedTab = document.querySelector('[data-tab="recently-viewed"]');
  if (recentViewedTab) {
      recentViewedTab.addEventListener('click', loadRecentlyViewedProducts);
  }
}

function loadRecentlyViewedProducts() {
  const tabContent = document.getElementById('recently-viewed-tab');
  if (tabContent.children.length > 0) return;
  
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
  

  initAddToCartButtons();
  initWishlistButtons();
}

function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('.product-name').textContent;
          const productPrice = productCard.querySelector('.current-price').textContent;
          showNotification(`${productName} a fost adăugat în coș`, 'success');
      });
  });
}

function initWishlistButtons() {
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  
  wishlistButtons.forEach(button => {
      button.addEventListener('click', function() {
          const icon = this.querySelector('i');
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('.product-name').textContent;
          
          if (icon.classList.contains('far')) {
              icon.classList.remove('far');
              icon.classList.add('fas');
              showNotification(`${productName} a fost adăugat la favorite`, 'success');
          } else {
              icon.classList.remove('fas');
              icon.classList.add('far');
              showNotification(`${productName} a fost eliminat de la favorite`, 'info');
          }
      });
  });
}

function showNotification(message, type) {
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
  }, 3000);
}


