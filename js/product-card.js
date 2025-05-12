// product-card.js - Funcționalități pentru cardurile de produse actualizate

document.addEventListener('DOMContentLoaded', function() {
 initProductCards();
});

function initProductCards() {
 // Inițializare butoane wishlist
 const wishlistButtons = document.querySelectorAll('.wishlist-btn');
 wishlistButtons.forEach(button => {
     button.addEventListener('click', function(e) {
         e.stopPropagation();
         const icon = this.querySelector('i');
         const productCard = this.closest('.product-card');
         const productName = productCard.querySelector('.product-name').textContent;
         
         if (icon.classList.contains('far')) {
             // Adaugă la favorite
             icon.classList.remove('far');
             icon.classList.add('fas');
             showNotification(`${productName} a fost adăugat la favorite`, 'success');
         } else {
             // Elimină de la favorite
             icon.classList.remove('fas');
             icon.classList.add('far');
             showNotification(`${productName} a fost eliminat de la favorite`, 'info');
         }
     });
 });
 
 // Inițializare butoane adăugare în coș
 const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
 addToCartButtons.forEach(button => {
     button.addEventListener('click', function(e) {
         e.stopPropagation();
         const productCard = this.closest('.product-card');
         const productName = productCard.querySelector('.product-name').textContent;
         const productPrice = productCard.querySelector('.current-price').textContent;
         
         // Efect de animație pentru buton
         this.style.transform = 'scale(0.9)';
         setTimeout(() => {
             this.style.transform = 'scale(1)';
         }, 200);
         
         // Afișare notificare
         showNotification(`${productName} a fost adăugat în coș`, 'success');
         
         // Actualizare counter coș (dacă există)
         updateCartCount();
     });
 });
 
 // Inițializare selecție culori
 const colorDots = document.querySelectorAll('.color-dot');
 colorDots.forEach(dot => {
     dot.addEventListener('click', function(e) {
         e.stopPropagation();
         
         // Elimină selecția anterioară
         const siblings = this.parentElement.querySelectorAll('.color-dot');
         siblings.forEach(sibling => sibling.classList.remove('selected'));
         
         // Adaugă selecție nouă
         this.classList.add('selected');
         
         // Poți adăuga aici logica pentru schimbarea imaginii produsului
     });
 });
 
 // Inițializare click pe card pentru a naviga la pagina produsului
 const productCards = document.querySelectorAll('.product-card');
 productCards.forEach(card => {
     card.addEventListener('click', function(e) {
         // Nu naviga dacă s-a făcut click pe butoane
         if (e.target.closest('.wishlist-btn') || 
             e.target.closest('.add-to-cart-btn') || 
             e.target.closest('.color-dot')) {
             return;
         }
         
         // Navighează la pagina produsului
         window.location.href = 'product.html';
     });
 });
}

// Funcție pentru actualizarea contorului coșului
function updateCartCount() {
 const cartBadge = document.querySelector('.cart-toggle .badge');
 if (cartBadge) {
     let currentCount = parseInt(cartBadge.textContent) || 0;
     cartBadge.textContent = currentCount + 1;
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
 
 // Ascunde notificarea după 3 secunde
 setTimeout(() => {
     notification.classList.remove('active');
     
     setTimeout(() => {
         notification.remove();
     }, 300);
 }, 3000);
}