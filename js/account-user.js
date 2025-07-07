document.addEventListener('DOMContentLoaded', function() {
 const navLinks = document.querySelectorAll('.account-navigation a');
 const sections = document.querySelectorAll('.account-section');
 const orderStatusFilter = document.getElementById('order-status-filter');
 const orderTableBody = document.getElementById('order-table-body');
 const profileForm = document.getElementById('profile-form');
 const wishlistGrid = document.querySelector('.wishlist-grid');
 const emptyWishlistMessage = document.querySelector('.empty-wishlist-message');

 // Funcție pentru afișarea unei secțiuni și ascunderea celorlalte
 function showSection(sectionId) {
  sections.forEach(section => {
   section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
 }

 // Funcție pentru gestionarea navigării
 function handleNavigation(e) {
  e.preventDefault();
  navLinks.forEach(link => {
   link.classList.remove('active');
  });
  this.classList.add('active');
  const sectionId = this.getAttribute('data-section');
  showSection(sectionId);
 }

 // Atașează event listener pentru fiecare link de navigare
 navLinks.forEach(link => {
  link.addEventListener('click', handleNavigation);
 });

 // Afișează secțiunea implicită (Profil) la încărcarea paginii
 showSection('profile');

 // Simulare date comenzi (înlocuiește cu date reale de la server)
 const orders = [
  { id: 12345, date: '2024-03-10', status: 'delivered', total: 1200 },
  { id: 12346, date: '2024-03-15', status: 'shipped', total: 850 },
  { id: 12347, date: '2024-03-20', status: 'processing', total: 320 },
 ];

 // Funcție pentru afișarea comenzilor
 function displayOrders(filteredOrders) {
  orderTableBody.innerHTML = filteredOrders.map(order => `
       <tr>
        <td>#${order.id}</td>
        <td>${order.date}</td>
        <td>${order.status}</td>
        <td>${order.total} lei</td>
        <td><a href="#">Vezi detalii</a></td>
       </tr>
     `).join('');
 }

 // Afișează toate comenzile inițial
 displayOrders(orders);

 // Filtrează comenzile după status
 if (orderStatusFilter) {
  orderStatusFilter.addEventListener('change', function() {
   const status = this.value;
   const filteredOrders = status === 'all' ? orders : orders.filter(order => order.status === status);
   displayOrders(filteredOrders);
  });
 }

 // Simulare produse favorite (înlocuiește cu date reale)
 const wishlistItems = [
  { id: 1, name: 'Rochie midi', image: 'images/rochie-midi.jpg', price: 500 },
  { id: 2, name: 'Pantaloni office', image: 'images/pantaloni-office.jpg', price: 320 },
 ];

 // Funcție pentru afișarea produselor favorite
 function displayWishlistItems() {
  if (wishlistGrid) {
   if (wishlistItems.length === 0) {
    if (emptyWishlistMessage) {
     emptyWishlistMessage.style.display = 'block';
    }
    wishlistGrid.innerHTML = '';
   } else {
    if (emptyWishlistMessage) {
     emptyWishlistMessage.style.display = 'none';
    }
    wishlistGrid.innerHTML = wishlistItems.map(item => `
         <div class="wishlist-item">
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.price} lei</p>
          <button class="btn-secondary remove-wishlist-item" data-id="${item.id}">Elimină</button>
         </div>
       `).join('');

    // Adaugă event listener pentru butoanele de eliminare
    const removeButtons = document.querySelectorAll('.remove-wishlist-item');
    removeButtons.forEach(button => {
     button.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id'));
      removeFromWishlist(itemId);
     });
    });
   }
  }
 }

 // Funcție pentru eliminarea unui produs din wishlist
 function removeFromWishlist(itemId) {
  const index = wishlistItems.findIndex(item => item.id === itemId);
  if (index !== -1) {
   wishlistItems.splice(index, 1);
   displayWishlistItems();
  }
 }

 // Afișează produsele favorite inițial
 displayWishlistItems();

 // Salvează modificările profilului (simulare)
 if (profileForm) {
  profileForm.addEventListener('submit', function(e) {
   e.preventDefault();
   // Aici ar trebui să trimiți datele la server
   alert('Modificările profilului au fost salvate!');
  });
 }

 // Alte funcționalități (schimbare parolă, etc.) (adăugați aici)
});