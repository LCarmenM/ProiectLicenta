// search-results.js - Funcționalități pentru pagina de rezultate căutare

document.addEventListener('DOMContentLoaded', function() {
 // Inițializare funcționalități pentru pagina de rezultate
 initSearchResultsPage();
});

function initSearchResultsPage() {
 // Obține parametrii din URL
 const urlParams = new URLSearchParams(window.location.search);
 const searchTerm = urlParams.get('q') || '';
 
 // Actualizează afișajul termenului de căutare
 updateSearchTermDisplay(searchTerm);
 
 // Încarcă produsele din "baza de date"
 const products = getProductDatabase();
 
 // Filtrează produsele după termenul de căutare
 let filteredProducts = filterProductsBySearchTerm(products, searchTerm);
 
 // Actualizează contorul de rezultate
 updateResultsCount(filteredProducts.length);
 
 // Inițializează filtrele pentru categorii
 initCategoryFilters(products, filteredProducts);
 
 // Inițializează filtrul de preț
 initPriceFilter(products, filteredProducts);
 
 // Inițializează filtrul de reduceri
 initDiscountFilter(filteredProducts);
 
 // Inițializează sortarea
 initSorting(filteredProducts);
 
 // Afișează rezultatele inițiale
 displaySearchResults(filteredProducts);
 
 // Inițializează formularul pentru a refina căutarea
 initSearchRefineForm();
 
 // Inițializează butonul de resetare filtre
 initResetFiltersButton();
}

// Funcție pentru obținerea produselor din "baza de date"
function getProductDatabase() {
 // Simulăm o bază de date cu produse 
 // În aplicația reală, aceste date ar veni de la server
 return [
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
}

// Funcție pentru filtrarea produselor după termenul de căutare
function filterProductsBySearchTerm(products, searchTerm) {
 if (!searchTerm) return products;
 
 return products.filter(product => {
   return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
 });
}

// Funcție pentru actualizarea afișajului termenului de căutare
function updateSearchTermDisplay(searchTerm) {
 const searchTermDisplay = document.getElementById('searchTermDisplay');
 const searchInput = document.getElementById('searchInput');
 
 if (searchTermDisplay && searchTerm) {
   searchTermDisplay.textContent = `Rezultate pentru: "${searchTerm}"`;
 } else if (searchTermDisplay) {
   searchTermDisplay.textContent = 'Toate produsele';
 }
 
 if (searchInput && searchTerm) {
   searchInput.value = searchTerm;
 }
}

// Funcție pentru actualizarea contorului de rezultate
function updateResultsCount(count) {
 const searchCountDisplay = document.getElementById('searchCountDisplay');
 const visibleResultsCount = document.getElementById('visibleResultsCount');
 
 if (searchCountDisplay) {
   searchCountDisplay.textContent = `${count} produse găsite`;
 }
 
 if (visibleResultsCount) {
   visibleResultsCount.textContent = `Se afișează ${count} produse`;
 }
}

// Funcție pentru inițializarea filtrelor de categorii
function initCategoryFilters(allProducts, filteredProducts) {
 const categoryFiltersContainer = document.getElementById('categoryFilters');
 
 if (!categoryFiltersContainer) return;
 
 // Obține categoriile unice și numără produsele din fiecare categorie
 const categories = {};
 filteredProducts.forEach(product => {
   if (!categories[product.category]) {
     categories[product.category] = 0;
   }
   categories[product.category]++;
 });
 
 // Creează elementele HTML pentru filtre
 let filtersHTML = '';
 for (const category in categories) {
   filtersHTML += `
     <li>
       <a href="#" class="filter-link" data-category="${category}">
         ${category} <span>(${categories[category]})</span>
       </a>
     </li>
   `;
 }
 
 // Adaugă filtru pentru "Toate"
 filtersHTML = `
   <li>
     <a href="#" class="filter-link active" data-category="all">
       Toate <span>(${filteredProducts.length})</span>
     </a>
   </li>
 ` + filtersHTML;
 
 categoryFiltersContainer.innerHTML = filtersHTML;
 
 // Adaugă event listeners pentru filtre
 const categoryLinks = document.querySelectorAll('.filter-link');
 categoryLinks.forEach(link => {
   link.addEventListener('click', function(e) {
     e.preventDefault();
     
     // Elimină clasa active de la toate link-urile
     categoryLinks.forEach(l => l.classList.remove('active'));
     
     // Adaugă clasa active la link-ul curent
     this.classList.add('active');
     
     // Obține categoria selectată
     const selectedCategory = this.getAttribute('data-category');
     
     // Aplică filtrele active
     applyFilters();
   });
 });
}

// Funcție pentru inițializarea filtrului de preț
function initPriceFilter(allProducts, filteredProducts) {
 const priceRange = document.getElementById('priceRange');
 const maxPriceDisplay = document.getElementById('maxPrice');
 
 if (!priceRange || !maxPriceDisplay) return;
 
 // Găsește prețul maxim dintre produse
 const maxPrice = Math.max(...filteredProducts.map(product => product.price));
 
 // Setează valoarea maximă pentru slider
 priceRange.max = maxPrice;
 priceRange.value = maxPrice;
 maxPriceDisplay.textContent = `${maxPrice} lei`;
 
 // Adaugă event listener pentru slider
 priceRange.addEventListener('input', function() {
   maxPriceDisplay.textContent = `${this.value} lei`;
   
   // Aplică filtrele active
   applyFilters();
 });
}

// Funcție pentru inițializarea filtrului de reduceri
function initDiscountFilter(filteredProducts) {
 const discountFilter = document.getElementById('discountFilter');
 
 if (!discountFilter) return;
 
 discountFilter.addEventListener('change', function() {
   // Aplică filtrele active
   applyFilters();
 });
}

// Funcție pentru inițializarea sortării
function initSorting(filteredProducts) {
 const sortSelect = document.getElementById('sort-select');
 
 if (!sortSelect) return;
 
 sortSelect.addEventListener('change', function() {
   // Aplică filtrele active și sortarea
   applyFilters();
 });
}

// Funcție pentru aplicarea tuturor filtrelor active
function applyFilters() {
 // Obține toate produsele
 const products = getProductDatabase();
 
 // Obține termenul de căutare
 const urlParams = new URLSearchParams(window.location.search);
 const searchTerm = urlParams.get('q') || '';
 
 // Filtrează după termenul de căutare
 let filteredProducts = filterProductsBySearchTerm(products, searchTerm);
 
 // Filtrează după categoria selectată
 const selectedCategory = document.querySelector('.filter-link.active').getAttribute('data-category');
 if (selectedCategory !== 'all') {
   filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
 }
 
 // Filtrează după preț
 const maxPrice = parseInt(document.getElementById('priceRange').value);
 filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
 
 // Filtrează după reduceri
 const discountFilter = document.getElementById('discountFilter');
 if (discountFilter && discountFilter.checked) {
   filteredProducts = filteredProducts.filter(product => product.price < product.originalPrice);
 }
 
 // Sortare
 const sortValue = document.getElementById('sort-select').value;
 switch (sortValue) {
   case 'price-asc':
     filteredProducts.sort((a, b) => a.price - b.price);
     break;
   case 'price-desc':
     filteredProducts.sort((a, b) => b.price - a.price);
     break;
   case 'name-asc':
     filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
     break;
   case 'name-desc':
     filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
     break;
   // Relevanța rămâne ordinea implicită
   default:
     break;
 }
 
 // Actualizează contorul de rezultate
 updateResultsCount(filteredProducts.length);
 
 // Afișează rezultatele filtrate
 displaySearchResults(filteredProducts);
}

// Funcție pentru afișarea rezultatelor căutării
function displaySearchResults(products) {
 const resultsGrid = document.getElementById('searchResultsGrid');
 const noResultsMessage = document.getElementById('noResultsMessage');
 
 if (!resultsGrid || !noResultsMessage) return;
 
 // Verifică dacă sunt rezultate
 if (products.length === 0) {
   resultsGrid.innerHTML = '';
   noResultsMessage.style.display = 'block';
   return;
 }
 
 noResultsMessage.style.display = 'none';
 
 // Construiește HTML-ul pentru rezultate
 let resultsHTML = '';
 
 products.forEach(product => {
   const hasDiscount = product.originalPrice > product.price;
   const discountPercentage = Math.round((product.originalPrice - product.price) / product.originalPrice * 100);
   
   resultsHTML += `
     <div class="product-card">
       <div class="product-image">
         <img src="${product.image}" alt="${product.name}">
         <div class="product-badges">
           ${hasDiscount ? `<span class="badge-discount">-${discountPercentage}%</span>` : ''}
         </div>
         <button class="wishlist-btn" aria-label="Adaugă la favorite"><i class="far fa-heart"></i></button>
         <div class="quick-view">
           <button class="quick-view-btn">Previzualizare rapidă</button>
         </div>
       </div>
       <div class="product-info">
         <div class="product-category">${product.category}</div>
         <h3 class="product-name">${product.name}</h3>
         <div class="product-price">
           <span class="current-price">${product.price} lei</span>
           ${hasDiscount ? `<span class="old-price">${product.originalPrice} lei</span>` : ''}
         </div>
         <button class="add-to-cart-btn">Adaugă în coș</button>
       </div>
     </div>
   `;
 });
 
 resultsGrid.innerHTML = resultsHTML;
 
 // Inițializează butoanele de wishlist
 initWishlistButtons();
 
 // Inițializează butoanele de adăugare în coș
 initAddToCartButtons();
 
 // Inițializează butoanele de previzualizare rapidă
 initQuickViewButtons();
}

// Funcție pentru inițializarea butoanelor de wishlist
function initWishlistButtons() {
 const wishlistButtons = document.querySelectorAll('.wishlist-btn');
 
 wishlistButtons.forEach(button => {
   button.addEventListener('click', function() {
     const icon = this.querySelector('i');
     
     if (icon.classList.contains('far')) {
       // Adaugă la favorite
       icon.classList.remove('far');
       icon.classList.add('fas');
       showNotification('Produs adăugat la favorite', 'success');
     } else {
       // Elimină de la favorite
       icon.classList.remove('fas');
       icon.classList.add('far');
       showNotification('Produs eliminat de la favorite', 'info');
     }
   });
 });
}

// Funcție pentru inițializarea butoanelor de adăugare în coș
function initAddToCartButtons() {
 const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
 
 addToCartButtons.forEach(button => {
   button.addEventListener('click', function() {
     const productCard = this.closest('.product-card');
     const productName = productCard.querySelector('.product-name').textContent;
     
     // Aici ar fi codul care adaugă produsul în coș
     showNotification(`${productName} a fost adăugat în coș`, 'success');
   });
 });
}

// Funcție pentru inițializarea butoanelor de previzualizare rapidă
function initQuickViewButtons() {
 const quickViewButtons = document.querySelectorAll('.quick-view-btn');
 
 quickViewButtons.forEach(button => {
   button.addEventListener('click', function() {
     const productCard = this.closest('.product-card');
     const productName = productCard.querySelector('.product-name').textContent;
     
     // Aici ar fi codul care deschide modalul de previzualizare rapidă
     showNotification(`Previzualizare pentru ${productName}`, 'info');
   });
 });
}

// Funcție pentru inițializarea formularului de căutare pentru a refina căutarea
function initSearchRefineForm() {
 const searchForm = document.getElementById('searchRefineForm');
 const searchInput = document.getElementById('searchInput');
 
 if (!searchForm || !searchInput) return;
 
 searchForm.addEventListener('submit', function(e) {
   e.preventDefault();
   
   const searchTerm = searchInput.value.trim();
   if (searchTerm) {
     // Redirecționează la aceeași pagină cu noul termen de căutare
     window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
   }
 });
}

// Funcție pentru inițializarea butonului de resetare filtre
function initResetFiltersButton() {
 const resetButton = document.getElementById('resetFilters');
 
 if (!resetButton) return;
 
 resetButton.addEventListener('click', function() {
   // Resetează filtrul de categorii
   const allCategoryLink = document.querySelector('.filter-link[data-category="all"]');
   if (allCategoryLink) {
     document.querySelectorAll('.filter-link').forEach(link => link.classList.remove('active'));
     allCategoryLink.classList.add('active');
   }
   
   // Resetează filtrul de preț
   const priceRange = document.getElementById('priceRange');
   const maxPriceDisplay = document.getElementById('maxPrice');
   if (priceRange && maxPriceDisplay) {
     const maxValue = priceRange.max;
     priceRange.value = maxValue;
     maxPriceDisplay.textContent = `${maxValue} lei`;
   }
   
   // Resetează filtrul de reduceri
   const discountFilter = document.getElementById('discountFilter');
   if (discountFilter) {
     discountFilter.checked = false;
   }
   
   // Resetează sortarea
   const sortSelect = document.getElementById('sort-select');
   if (sortSelect) {
     sortSelect.value = 'relevance';
   }
   
   // Aplică filtrele resetate
   applyFilters();
   
   showNotification('Filtrele au fost resetate', 'info');
 });
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
 
 // Ascunde notificarea automat după 3 secunde
 setTimeout(() => {
   notification.classList.remove('active');
   
   setTimeout(() => {
     notification.remove();
   }, 300);
 }, 3000);
}