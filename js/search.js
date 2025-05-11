// search.js - Funcționalitate de căutare pentru Dynasty Couture

document.addEventListener('DOMContentLoaded', function() {
 // Inițializare funcționalitate de căutare
 initSearchFunctionality();
});

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
 // În funcția displaySearchResults
function displaySearchResults(products, searchTerm) {
 // Eliminăm containerul anterior dacă există
 let searchResults = document.getElementById('searchResults');
 if (searchResults) {
   searchResults.remove();
 }
 
 // Creăm containerul de rezultate doar dacă există produse de afișat
 if (products && products.length > 0) {
   searchResults = document.createElement('div');
   searchResults.id = 'searchResults';
   searchResults.className = 'search-results';
   
   // Construim conținutul rezultatelor
   // ...
   
   // Adăugăm containerul în DOM
   const searchContainer = document.querySelector('.search-container');
   if (searchContainer) {
     searchContainer.appendChild(searchResults);
   }
 }
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
       const discountPercentage = Math.round((product.originalPrice - product.price) / product.originalPrice * 100);
       
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
   
   // Adaugă stiluri pentru rezultate dacă nu există deja
   addSearchResultsStyles();
 }
 
 // Funcție pentru adăugarea stilurilor pentru rezultatele căutării
 function addSearchResultsStyles() {
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
