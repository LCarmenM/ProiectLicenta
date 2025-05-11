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
      initializeHeaderScripts();
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

// Funcție pentru inițializarea tuturor funcționalităților din header
function initializeHeaderScripts() {
  // === VARIABILE GLOBALE ===
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const body = document.body;
  
  // Verificăm dacă toate elementele necesare există
  if (!menuToggle || !mobileMenu || !menuOverlay || !closeMenu) {
    console.warn("Unele elemente ale meniului nu au fost găsite.");
    return;
  }
  
  // === INIȚIALIZARE MENIU MOBIL ===
  // Deschide meniul mobil
  menuToggle.addEventListener('click', function() {
    console.log("Menu toggle clicked");
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    body.classList.add('menu-open');
    
    // Inițializează dropdown-urile în meniul mobil (doar după ce meniul a fost deschis)
    initializeMobileDropdowns();
    
    // Animație pentru elemente
    animateMobileMenuItems();
  });
  
  // Închide meniul mobil
  closeMenu.addEventListener('click', function() {
    closeMobileMenu();
  });
  
  // Închide meniul la click pe overlay
  menuOverlay.addEventListener('click', function() {
    closeMobileMenu();
  });
  
  // === INIȚIALIZARE OVERLAY CĂUTARE ===
  if (searchToggle && searchOverlay && closeSearch) {
    // Deschide overlay căutare
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchOverlay.classList.add('active');
      body.classList.add('menu-open');
      
      // Focus pe câmpul de căutare
      setTimeout(() => {
        const searchInput = searchOverlay.querySelector('input');
        if (searchInput) {
          searchInput.focus();
        }
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
  }
}

// Funcție pentru inițializarea dropdown-urilor din meniul mobil
function initializeMobileDropdowns() {
  console.log("Initializing mobile dropdowns");
  // Dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  if (dropdownToggles && dropdownToggles.length > 0) {
    dropdownToggles.forEach(toggle => {
      // Eliminăm eventListener-ul existent pentru a preveni duplicarea
      toggle.removeEventListener('click', toggleDropdown);
      
      // Adăugăm noul eventListener
      toggle.addEventListener('click', toggleDropdown);
    });
  } else {
    console.warn("No dropdown toggles found");
  }
  
  // Sub-dropdown toggles
  const subDropdownToggles = document.querySelectorAll('.sub-dropdown-toggle');
  
  if (subDropdownToggles && subDropdownToggles.length > 0) {
    subDropdownToggles.forEach(toggle => {
      // Eliminăm eventListener-ul existent pentru a preveni duplicarea
      toggle.removeEventListener('click', toggleSubDropdown);
      
      // Adăugăm noul eventListener
      toggle.addEventListener('click', toggleSubDropdown);
    });
  } else {
    console.warn("No sub-dropdown toggles found");
  }
}

// Handler pentru toggle dropdown principal
function toggleDropdown(event) {
  console.log("Toggle dropdown clicked");
  const parentItem = this.parentElement;
  
  // Închide toate celelalte dropdown-uri de pe același nivel
  const siblingItems = document.querySelectorAll('.mobile-nav-item.active');
  siblingItems.forEach(item => {
    if (item !== parentItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle pentru dropdown-ul curent
  parentItem.classList.toggle('active');
}

// Handler pentru toggle sub-dropdown
function toggleSubDropdown(event) {
  console.log("Toggle sub-dropdown clicked");
  event.stopPropagation(); // Previne propagarea evenimentului către părinte
  const parentItem = this.parentElement;
  
  // Toggle pentru sub-dropdown-ul curent
  parentItem.classList.toggle('active');
}

// Funcție pentru animarea elementelor din