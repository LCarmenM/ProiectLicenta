function initializeHeaderScripts() {
    // Cod direct pentru gestionarea meniului mobil
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    
    if (menuToggle && mobileMenu && menuOverlay) {
      menuToggle.addEventListener('click', function() {
        console.log("Menu toggle clicked"); // Pentru debugging
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
      });
    } else {
      console.log("Elements not found:", {menuToggle, mobileMenu, menuOverlay}); // Pentru debugging
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
    
    // Alte funcționalități ale header-ului...
  }