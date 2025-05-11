document.addEventListener('DOMContentLoaded', function() {
  // Încarcă header-ul
  fetch('header.html')
  .then(response => response.text())
  .then(data => {
   document.getElementById('header-placeholder').innerHTML = data;

   // Adaugă CSS-ul pentru header după încărcarea header-ului
   if (!document.querySelector('link[href="css/header.css"]')) {
    const headerCSS = document.createElement('link');
    headerCSS.rel = 'stylesheet';
    headerCSS.href = 'css/header.css';
    document.head.appendChild(headerCSS);
   }

   // Inițializează scripturile pentru header
   initHeaderScripts();
  });

  // Încarcă footer-ul
  fetch('footer.html')
  .then(response => response.text())
  .then(data => {
   document.getElementById('footer-placeholder').innerHTML = data;

   // Adaugă CSS-ul pentru footer după încărcarea footer-ului
   if (!document.querySelector('link[href="css/footer.css"]')) {
    const footerCSS = document.createElement('link');
    footerCSS.rel = 'stylesheet';
    footerCSS.href = 'css/footer.css';
    document.head.appendChild(footerCSS);
   }
  });
 });

 // includes.js

 // Funcție pentru inițializarea tuturor funcționalităților din header
 function initHeaderScripts() {
  // === VARIABILE GLOBALE ===
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const body = document.body;
  const searchForm = document.querySelector('.search-form'); // Selectăm formularul
  const searchInput = document.querySelector('.search-form input'); // Selectăm input-ul

  // === INIȚIALIZARE MENIU MOBIL ===
  // Deschide meniul mobil
  if (menuToggle && mobileMenu && menuOverlay) {
   menuToggle.addEventListener('click', function() {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    body.classList.add('menu-open');

    // Inițializează dropdown-urile în meniul mobil
    initMobileDropdowns();
   });
  }

  // Închide meniul mobil
  if (closeMenu && mobileMenu && menuOverlay) {
   closeMenu.addEventListener('click', function() {
    closeMobileMenu();
   });

   menuOverlay.addEventListener('click', function() {
    closeMobileMenu();
   });
  }

  // Funcție pentru închiderea meniului mobil
  function closeMobileMenu() {
   if (mobileMenu && menuOverlay) {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');
   }
  }

  // === INIȚIALIZARE OVERLAY CĂUTARE ===
  if (searchToggle && searchOverlay && closeSearch && searchForm && searchInput) { // Verificăm și formularul și input-ul
   // Deschide overlay căutare
   searchToggle.addEventListener('click', function(e) {
    e.preventDefault();
    searchOverlay.classList.add('active');
    body.classList.add('menu-open');

    // Focus pe câmpul de căutare
    setTimeout(() => {
     searchInput.focus();
    }, 300);
   });

   // Închide overlay căutare
   closeSearch.addEventListener('click', function() {
    searchOverlay.classList.remove('active');
    body.classList.remove('menu-open');
   });

   // Închide overlay căutare la apăsarea tastei Escape
   document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
     searchOverlay.classList.remove('active');
     body.classList.remove('menu-open');
    }
   });

   // Gestionarea submit-ului formularului de căutare
   searchForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Previne acțiunea implicită de submit

    const searchTerm = searchInput.value.trim(); // Obține termenul de căutare și elimină spațiile inutile
    if (searchTerm) {
     // Verifică dacă există un termen de căutare
     performSearch(searchTerm); // Apelează funcția de căutare
    }
   });
  }

  // === INIȚIALIZARE DROPDOWN-URI MENIU MOBIL ===
  function initMobileDropdowns() {
   // Dropdown-uri principale
   const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

   if (dropdownToggles) {
    dropdownToggles.forEach(toggle => {
     // Eliminăm eventListener-ul existent pentru a preveni duplicarea
     toggle.removeEventListener('click', toggleDropdown);

     // Adăugăm noul eventListener
     toggle.addEventListener('click', toggleDropdown);
    });
   }

   // Sub-dropdown-uri
   const subDropdownToggles = document.querySelectorAll('.sub-dropdown-toggle');

   if (subDropdownToggles) {
    subDropdownToggles.forEach(toggle => {
     // Eliminăm eventListener-ul existent pentru a preveni duplicarea
     toggle.removeEventListener('click', toggleSubDropdown);

     // Adăugăm noul eventListener
     toggle.addEventListener('click', toggleSubDropdown);
    });
   }
  }

  // Handler pentru dropdown-urile principale
  function toggleDropdown(e) {
   e.preventDefault();
   const parentItem = this.parentElement;

   // Închide toate celelalte dropdown-uri deschise dacă se deschide unul nou
   const siblingItems = document.querySelectorAll('.mobile-nav-item.dropdown');
   siblingItems.forEach(item => {
    if (item !== parentItem && item.classList.contains('active')) {
     item.classList.remove('active');
    }
   });

   // Toggle pentru dropdown-ul curent
   parentItem.classList.toggle('active');
  }

  // Handler pentru sub-dropdown-uri
  function toggleSubDropdown(e) {
   e.preventDefault();
   e.stopPropagation(); // Previne propagarea către dropdown-ul părinte
   const parentItem = this.parentElement;

   // Toggle pentru sub-dropdown-ul curent
   parentItem.classList.toggle('active');
  }

  // === INIȚIALIZARE MEGA MENU (PENTRU DESKTOP) ===
  const categoryItems = document.querySelectorAll('.category-item');
  if (categoryItems.length > 0) {
   categoryItems.forEach(item => {
    item.addEventListener('mouseover', function() {
     // Elimină clasa 'active' de la toate elementele
     categoryItems.forEach(el => el.classList.remove('active'));
     // Adaugă clasa 'active' elementului curent
     this.classList.add('active');
    });
   });

   // Activează implicit prima categorie
   categoryItems[0].classList.add('active');
  }

  // === INIȚIALIZARE ACCOUNT DROPDOWN ===
  const accountToggle = document.querySelector('.account-toggle');
  const accountDropdown = document.querySelector('.account-dropdown');

  if (accountToggle && accountDropdown) {
   accountToggle.addEventListener('click', function(e) {
    e.preventDefault();
    accountDropdown.classList.toggle('active');
   });

   // Închide dropdown-ul la click în afara acestuia
   document.addEventListener('click', function(e) {
    if (!accountToggle.contains(e.target) && !accountDropdown.contains(e.target)) {
     accountDropdown.classList.remove('active');
    }
   });
  }

  // === INIȚIALIZARE CART SIDEBAR ===
  const cartToggle = document.querySelector('.cart-toggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCart = document.getElementById('closeCart');

  if (cartToggle && cartSidebar && cartOverlay) {
   cartToggle.addEventListener('click', function(e) {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    body.style.overflow = 'hidden';
   });

   if (closeCart) {
    closeCart.addEventListener('click', function() {
     cartSidebar.classList.remove('active');
     cartOverlay.classList.remove('active');
     body.style.overflow = '';
    });
   }

   if (cartOverlay) {
    cartOverlay.addEventListener('click', function() {
     cartSidebar.classList.remove('active');
     cartOverlay.classList.remove('active');
     body.style.overflow = '';
    });
   }
  }
 }

 // === FUNCȚIONALITATEA CĂUTĂRII ===
 // Funcție pentru a realiza căutarea
 function performSearch(searchTerm) {
  // Simulare: Afișează termenul căutat într-o alertă
  alert(`Ai căutat: ${searchTerm}\n(Funcționalitatea completă de căutare va fi implementată în curând.)`);

  // Aici vei înlocui cu logica reală de căutare (ex: fetch către un API, căutare în localStorage)
  // Exemplu de redirecționare către o pagină de rezultate:
  // window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
 }

 // Funcție pentru actualizarea contorului de favorite
 function updateWishlistCount(count) {
  const wishlistBadge = document.getElementById('wishlist-badge');
  if (wishlistBadge) {
   wishlistBadge.textContent = count;
  }
 }

 // Funcție pentru actualizarea contorului de coș
 function updateCartCount(count) {
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
   cartBadge.textContent = count;
  }
 }