document.addEventListener('DOMContentLoaded', function() {
  // Încarcă header-ul
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      
      // Inițializează scripturile pentru header DUPĂ ce conținutul a fost adăugat în DOM
      initializeHeaderScripts();
    });
  
  // Încarcă footer-ul
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });
});

// Funcție pentru inițializarea evenimentelor din header
function initializeHeaderScripts() {
  // Inițializează meniul mobil
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');
  
  if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.classList.add('menu-open');
    });
  }
  
  if (closeMenu && mobileMenu && menuOverlay) {
    closeMenu.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
    
    menuOverlay.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }
  
  // Inițializează alte funcționalități din header cum ar fi căutarea, dropdown-urile, etc.
  // ...
  
  // Dacă aveți nevoie de funcționalitate din main.js, o puteți încărca și executa aici
  const headerScript = document.createElement('script');
  headerScript.src = 'js/main.js';
  document.body.appendChild(headerScript);
}