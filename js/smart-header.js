// js/smart-header.js - Header inteligent cu delay de 30 secunde și trigger la acțiuni

document.addEventListener('DOMContentLoaded', function() {
 initSmartHeader();
});

function initSmartHeader() {
 const header = document.querySelector('header');
 if (!header) return;

 let lastScrollTop = 0;
 let isHeaderHidden = false;
 let scrollTimeout;
 let stopScrollDelay = 30000; // 30 secunde în milisecunde
 let isScrolling = false;
 
 // Funcții pentru afișare/ascundere header
 function hideHeader() {
     if (!isHeaderHidden) {
         header.classList.add('header-hidden');
         header.classList.remove('header-visible', 'header-force-show');
         isHeaderHidden = true;
     }
 }

 function showHeader(force = false) {
     if (isHeaderHidden || force) {
         header.classList.remove('header-hidden');
         header.classList.add('header-visible');
         
         if (force) {
             header.classList.add('header-force-show');
             setTimeout(() => {
                 header.classList.remove('header-force-show');
             }, 300);
         }
         
         isHeaderHidden = false;
     }
     
     // Efect blur la scroll
     if (window.pageYOffset > 50) {
         header.classList.add('scrolled');
     } else {
         header.classList.remove('scrolled');
     }
 }

 // Event listener pentru scroll
 window.addEventListener('scroll', function() {
     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
     
     if (currentScrollTop < 0) return;
     
     // Setează flag-ul de scrolling
     isScrolling = true;
     
     // Curăță timeout-ul anterior
     clearTimeout(scrollTimeout);
     
     // La începutul paginii, afișează mereu header-ul
     if (currentScrollTop <= 50) {
         showHeader();
         lastScrollTop = currentScrollTop;
         return;
     }
     
     // Verifică direcția scroll-ului
     if (currentScrollTop > lastScrollTop) {
         // Scroll în jos - ascunde header
         hideHeader();
     } else {
         // Scroll în sus - afișează header imediat
         showHeader();
     }
     
     // Timeout pentru afișare după 30 secunde de oprire scroll
     scrollTimeout = setTimeout(function() {
         isScrolling = false;
         if (isHeaderHidden) {
             showHeader(true); // Forțează afișarea cu animație
         }
     }, stopScrollDelay);
     
     lastScrollTop = currentScrollTop;
 });

 // Funcție globală pentru a afișa header-ul la acțiuni utilizator
 window.showHeaderOnAction = function() {
     showHeader(true); // Forțează afișarea cu animație
     // Resetează timeout-ul dacă utilizatorul face o acțiune
     clearTimeout(scrollTimeout);
     
     // Setează un nou timeout
     if (isScrolling) {
         scrollTimeout = setTimeout(function() {
             isScrolling = false;
             if (isHeaderHidden) {
                 showHeader(true);
             }
         }, stopScrollDelay);
     }
 };

 // Modifică funcția pentru afișare pe hover la zona de sus
 let headerHoverTimeout;
 
 // Creează o zonă invizibilă la partea de sus pentru hover
 const hoverZone = document.createElement('div');
 hoverZone.style.cssText = `
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 5px;
     z-index: 99;
     pointer-events: auto;
 `;
 document.body.appendChild(hoverZone);

 hoverZone.addEventListener('mouseenter', function() {
     clearTimeout(headerHoverTimeout);
     if (isHeaderHidden) {
         showHeader(true);
     }
 });

 // Ascunde header-ul din nou după ce mouse-ul părăsește zona de header
 header.addEventListener('mouseleave', function() {
     if (window.pageYOffset > 50) {
         headerHoverTimeout = setTimeout(() => {
             if (!isScrolling) {
                 hideHeader();
             }
         }, 2000); // Ascunde după 2 secunde de la părăsirea header-ului
     }
 });

 // Anulează ascunderea dacă mouse-ul revine pe header
 header.addEventListener('mouseenter', function() {
     clearTimeout(headerHoverTimeout);
 });
}

// Funcții pentru integrarea cu alte componente

// Funcție pentru butoanele de adăugare în coș
function setupCartButtons() {
 const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart');
 
 addToCartButtons.forEach(button => {
     button.addEventListener('click', function() {
         // Afișează header-ul când se adaugă produs în coș
         if (typeof window.showHeaderOnAction === 'function') {
             window.showHeaderOnAction();
         }
     });
 });
}

// Funcție pentru butoanele de wishlist
function setupWishlistButtons() {
 const wishlistButtons = document.querySelectorAll('.wishlist-btn, .wishlist-toggle');
 
 wishlistButtons.forEach(button => {
     button.addEventListener('click', function() {
         // Afișează header-ul când se adaugă/elimină din wishlist
         if (typeof window.showHeaderOnAction === 'function') {
             window.showHeaderOnAction();
         }
     });
 });
}

// Funcție pentru butoanele de căutare
function setupSearchButtons() {
 const searchButtons = document.querySelectorAll('.search-toggle, .search-form button');
 
 searchButtons.forEach(button => {
     button.addEventListener('click', function() {
         // Afișează header-ul când se folosește căutarea
         if (typeof window.showHeaderOnAction === 'function') {
             window.showHeaderOnAction();
         }
     });
 });
}

// Funcție pentru notificări
function setupNotificationTriggers() {
 // Observer pentru notificări noi
 const notificationObserver = new MutationObserver(function(mutations) {
     mutations.forEach(function(mutation) {
         mutation.addedNodes.forEach(function(node) {
             if (node.nodeType === 1 && node.classList && node.classList.contains('notification')) {
                 // Afișează header-ul când apare o notificare
                 if (typeof window.showHeaderOnAction === 'function') {
                     window.showHeaderOnAction();
                 }
             }
         });
     });
 });

 // Observă adăugarea de notificări
 const notificationContainer = document.body;
 if (notificationContainer) {
     notificationObserver.observe(notificationContainer, {
         childList: true,
         subtree: true
     });
 }
}

// Inițializare la încărcarea completă a paginii
document.addEventListener('DOMContentLoaded', function() {
 // Așteaptă un pic pentru ca toate elementele să se încarce
 setTimeout(() => {
     setupCartButtons();
     setupWishlistButtons();
     setupSearchButtons();
     setupNotificationTriggers();
 }, 100);
});

// Re-inițializare la schimbări dinamice în DOM
const dynamicObserver = new MutationObserver(function(mutations) {
 let shouldReinit = false;
 
 mutations.forEach(function(mutation) {
     mutation.addedNodes.forEach(function(node) {
         if (node.nodeType === 1) {
             // Verifică dacă s-au adăugat butoane noi
             if (node.classList && (
                 node.classList.contains('add-to-cart-btn') ||
                 node.classList.contains('wishlist-btn') ||
                 node.classList.contains('search-toggle')
             )) {
                 shouldReinit = true;
             }
             
             // Verifică dacă există butoane în interiorul nodului adăugat
             if (node.querySelector && (
                 node.querySelector('.add-to-cart-btn') ||
                 node.querySelector('.wishlist-btn') ||
                 node.querySelector('.search-toggle')
             )) {
                 shouldReinit = true;
             }
         }
     });
 });
 
 if (shouldReinit) {
     setTimeout(() => {
         setupCartButtons();
         setupWishlistButtons();
         setupSearchButtons();
     }, 50);
 }
});

// Observă întregul document pentru schimbări
dynamicObserver.observe(document.body, {
 childList: true,
 subtree: true
});

// Export pentru utilizare în alte module
if (typeof module !== 'undefined' && module.exports) {
 module.exports = {
     initSmartHeader,
     setupCartButtons,
     setupWishlistButtons,
     setupSearchButtons
 };
}