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
   
   // Încarcă și inițializează funcționalitatea de căutare
   loadSearchFunctionality();
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

// Funcție pentru încărcarea funcționalității de căutare
function loadSearchFunctionality() {
  // Verifică dacă scriptul de căutare există deja
  if (!document.querySelector('script[src="js/search.js"]')) {
    const searchScript = document.createElement('script');
    searchScript.src = 'js/search.js';
    document.body.appendChild(searchScript);
  }
  
  // Adaugă CSS-ul de căutare dacă nu există
  if (!document.getElementById('searchResultsStyles')) {
    const styles = document.createElement('style');
    styles.id = 'searchResultsStyles';
    styles.textContent = `
      .search-results {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        margin-top: 20px;
        max-height: 60vh;
        overflow-y: auto;
        padding: 20px;
      }
      
      .results-header {
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
        padding-bottom: 10px;
      }
      
      .results-header h3 {
        color: #222;
        font-size: 1.1rem;
        margin-bottom: 5px;
      }
      
      .results-header p {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
      }
      
      .results-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }
      
      .search-product {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #eee;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .search-product:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .product-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }
      
      .product-image {
        position: relative;
        height: 150px;
        overflow: hidden;
      }
      
      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .search-product:hover .product-image img {
        transform: scale(1.05);
      }
      
      .discount-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: #c62828;
        color: white;
        font-size: 0.8rem;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 3px;
      }
      
      .product-info {
        padding: 12px;
      }
      
      .product-name {
        font-size: 0.95rem;
        font-weight: 500;
        margin: 0 0 5px;
        color: #222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .product-category {
        color: #666;
        font-size: 0.8rem;
        margin-bottom: 8px;
      }
      
      .product-price {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .current-price {
        font-weight: 600;
        color: #222;
        font-size: 0.95rem;
      }
      
      .original-price {
        text-decoration: line-through;
        color: #888;
        font-size: 0.85rem;
      }
      
      .view-all-results {
        margin-top: 20px;
        text-align: center;
      }
      
      .view-all-results a {
        color: #222;
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: underline;
        transition: color 0.3s ease;
      }
      
      .view-all-results a:hover {
        color: #c62828;
      }
      
      .no-results {
        padding: 20px;
        text-align: center;
      }
      
      .no-results p {
        margin-bottom: 10px;
        color: #666;
      }
      
      .no-results ul {
        text-align: left;
        margin: 0 auto;
        max-width: 300px;
        padding-left: 20px;
      }
      
      .no-results li {
        margin-bottom: 5px;
        color: #666;
      }
      
      /* Responsivitate */
      @media (max-width: 768px) {
        .results-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 480px) {
        .results-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

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
    closeSearchOverlay();
   });

   // Închide overlay căutare la apăsarea tastei Escape
   document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
     closeSearchOverlay();
    }
   });
  }
  
  // Funcție pentru închiderea overlay-ului de căutare
  function closeSearchOverlay() {
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
      body.classList.remove('menu-open');
      
      // Curăță rezultatele anterioare dacă există
      const searchResults = document.getElementById('searchResults');
      if (searchResults) {
        searchResults.innerHTML = '';
      }
    }
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