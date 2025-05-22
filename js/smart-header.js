// smart-header.js - Header inteligent cu delay de 30 secunde și trigger la acțiuni

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
 
 window.addEventListener('scroll', function() {
     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
     
     if (currentScrollTop < 0) return;
     
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
     
     // Timeout pentru afișare după 30 secunde la stop scroll
     scrollTimeout = setTimeout(function() {
         if (isHeaderHidden) {
             showHeader();
         }
     }, stopScrollDelay);
     
     lastScrollTop = currentScrollTop;
 });

 function hideHeader() {
     if (!isHeaderHidden) {
         header.classList.add('header-hidden');
         isHeaderHidden = true;
     }
 }

 function showHeader() {
     if (isHeaderHidden) {
         header.classList.remove('header-hidden');
         isHeaderHidden = false;
     }
     
     // Efect blur la scroll
     if (window.pageYOffset > 50) {
         header.classList.add('scrolled');
     } else {
         header.classList.remove('scrolled');
     }
 }

 // Funcție globală pentru a afișa header-ul la acțiuni utilizator
 window.showHeaderOnAction = function() {
     showHeader();
     // Resetează timeout-ul dacă utilizatorul face o acțiune
     clearTimeout(scrollTimeout);
 };
}