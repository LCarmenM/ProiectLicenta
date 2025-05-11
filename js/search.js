// search.js - Funcționalitate de căutare pentru Dynasty Couture

document.addEventListener('DOMContentLoaded', function() {
 // Inițializare funcționalitate de căutare
 initSearchFunctionality();
});

// Exportăm funcția de inițializare la nivel global pentru a o putea apela din includes.js
window.initSearchFunctionality = initSearchFunctionality;

function initSearchFunctionality() {
 // Elemente pentru căutare
 const searchToggle = document.querySelector('.search-toggle');
 const searchOverlay = document.getElementById('searchOverlay');
 const closeSearch = document.getElementById('closeSearch');
 const searchForm = document.querySelector('.search-form');
 const searchInput = document.querySelector('.search-form input');
 const body = document.body;
 
 // Verifică dacă elementele există
 if (searchToggle && searchOverlay && closeSearch && searchForm && searchInput) {
   console.log('Inițializare funcționalitate de căutare...');
   
   // Deschide overlay-ul de căutare
   searchToggle.addEventListener('click', function(e) {
     e.preventDefault();
     searchOverlay.classList.add('active');
     body.classList.add('menu-open');
     
     // Focus pe câmpul de căutare cu mică întârziere pentru animație
     setTimeout(() => {
       searchInput.focus();
     }, 300);
   });
   
   // Închide overlay-ul de căutare
   closeSearch.addEventListener('click', function() {
     closeSearchOverlay();
   });
   
   // Închide overlay-ul la apăsarea tastei Escape
   document.addEventListener('keydown', function(e) {
     if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
       closeSearchOverlay();
     }
   });
   
   // Procesare formular de căutare
   searchForm.addEventListener('submit', function(e) {
     e.preventDefault();
     
     const searchTerm = searchInput.value.trim();
     if (searchTerm) {
       // Efectuează căutarea
       performSearch(searchTerm);
     }
   });
 } else {
   console.warn('Unele elemente necesare pentru funcționalitatea de căutare nu au fost găsite.');
   console.log({
     searchToggle: !!searchToggle,
     searchOverlay: !!searchOverlay,
     closeSearch: !!closeSearch,
     searchForm: !!searchForm,
     searchInput: !!searchInput
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
 
 // Funcție pentru căutare
 function performSearch(searchTerm) {
   // Simulăm o bază de date cu produse
   const products = [
     { id: 1, name: 'Rochie midi de seară', category: 'Femei', price: 500, originalPrice: 1000, image: 'images/rochie-midi-seara.jpg', url: 'product.html' },
     { id: 2, name: 'Costum bărbați', category: 'Bărbați', price: 1200, originalPrice: 1200, image: 'images/costum-barbati.jpg', url: 'product-costum.html' },
     { id: 3, name: 'Bluză din satin', category: 'Femei', price: 250, originalPrice: 250, image: 'images/bluza-satin.jpg', url: 'product-bluza.html' },
     { id: 4, name: 'Geantă piele', category: 'Accesorii', price: 750, originalPrice: 750, image: 'images/geanta-piele.jpg', url: 'product-geanta.html' },
     { id: 5, name: 'Pantaloni office', category: 'Femei', price: 320, originalPrice: 320, image: 'images/pantaloni-office.jpg', url: 'product-pantaloni.html' },
     { id: 6, name: 'Pantofi Oxford', category: 'Bărbați', price: 680, originalPrice: 800, image: 'images/pantofi-oxford.jpg', url: 'product-pantofi.html' },
     { id: 7, name: 'Fustă plisată', category: 'Femei', price: 280, originalPrice: 280, image: 'images/fusta-plisata.jpg', url: 'product-fusta.html' },
     { id: 8, name: 'Ceas bărbați', category: 'Accesorii', price: 1500, originalPrice: 1500, image: 'images/ceas-barbati.jpg', url: 'product-ceas.html' },
     { id: 9, name: 'Cercei argint', category: 'Bijuterii', price: 350, originalPrice: 350, image: 'images/cercei-argint.jpg', url: 'product-cercei.html' },
     { id: 10, name: 'Sandale', category: 'Femei', price: 450, originalPrice: 450, image: 'images/sandale.jpg', url: 'product-sandale.html' },
     { id: 11, name: 'Lănțișor', category: 'Bijuterii', price: 1450, originalPrice: 1450, image: 'images/lant.jpg', url: 'product-lantior.html' },
     { id: 12, name: 'Inel', category: 'Bijuterii', price: 700, originalPrice: 700, image: 'images/inel.jpg', url: 'product-inel.html' }
   ];
   
   // Filtrăm produsele după termenul de căutare (nume și categorie)
   const filteredProducts = products.filter(product => {
     return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
   });
   
   // Afișăm rezultatele căutării
   displaySearchResults(filteredProducts, searchTerm);
 }
 
 // Funcție pentru afișarea rezultatelor
 function displaySearchResults(products, searchTerm) {
   // Obținem containerul de rezultate
   let searchResults = document.getElementById('searchResults');
   
   // Verifică dacă avem un container de rezultate și creează unul dacă nu există
   if (!searchResults) {
     const searchContainer = document.querySelector('.search-container');
     if (searchContainer) {
       const resultsDiv = document.createElement('div');
       resultsDiv.id = 'searchResults';
       resultsDiv.className = 'search-results';
       searchContainer.appendChild(resultsDiv);
       searchResults = resultsDiv;
     } else {
       console.error('Container pentru rezultate negăsit');
       return;
     }
   } else {
     // Curăță rezultatele anterioare
     searchResults.innerHTML = '';
   }
   
   // Verifică dacă sunt rezultate
   if (products.length === 0) {
     searchResults.innerHTML = `
       <div class="no-results">
         <p>Nu s-au găsit rezultate pentru "<strong>${searchTerm}</strong>".</p>
         <p>Sugestii:</p>
         <ul>
           <li>Verifică ortografia termenului căutat.</li>
           <li>Încearcă termeni mai generali.</li>
           <li>Încearcă categorii precum "Femei", "Bărbați", "Accesorii".</li>
         </ul>
       </div>
     `;
   } else {
     // Construiește HTML-ul pentru rezultate
     let resultsHTML = `
       <div class="results-header">
         <h3>Rezultate pentru "<strong>${searchTerm}</strong>"</h3>
         <p>${products.length} produse găsite</p>
       </div>
       <div class="results-grid">
     `;
     
     // Adaugă fiecare produs
     products.forEach(product => {
       const hasDiscount = product.originalPrice > product.price;
       const discountPercentage = hasDiscount ? 
         Math.round((product.originalPrice - product.price) / product.originalPrice * 100) : 0;
       
       resultsHTML += `
         <div class="search-product">
           <a href="${product.url}" class="product-link">
             <div class="product-image">
               <img src="${product.image}" alt="${product.name}">
               ${hasDiscount ? `<span class="discount-badge">-${discountPercentage}%</span>` : ''}
             </div>
             <div class="product-info">
               <h4 class="product-name">${product.name}</h4>
               <div class="product-category">${product.category}</div>
               <div class="product-price">
                 <span class="current-price">${product.price} lei</span>
                 ${hasDiscount ? `<span class="original-price">${product.originalPrice} lei</span>` : ''}
               </div>
             </div>
           </a>
         </div>
       `;
     });
     
     resultsHTML += `
       </div>
       <div class="view-all-results">
         <a href="search-results.html?q=${encodeURIComponent(searchTerm)}">Vezi toate rezultatele</a>
       </div>
     `;
     
     searchResults.innerHTML = resultsHTML;
   }
   
   // Asigură-te că rezultatele sunt vizibile
   searchResults.style.display = 'block';
 }
}