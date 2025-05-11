document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const body = document.body;
    
    // Deschide meniul mobil
    if (menuToggle && mobileMenu && menuOverlay) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            body.classList.add('menu-open');
        });
    }
    
    // Închide meniul mobil
    if (closeMenu && mobileMenu && menuOverlay) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
        
        menuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    }
    
    // Mega Menu - Desktop
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            // Elimină clasa active de la toate elementele
            categoryItems.forEach(el => el.classList.remove('active'));
            
            // Adaugă clasa active elementului curent
            this.classList.add('active');
        });
    });
    
    // Activează implicit prima categorie
    if (categoryItems.length > 0) {
        categoryItems[0].classList.add('active');
    }
    
    // Dropdown meniu mobil
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });
    
    // Sub-dropdown meniu mobil
    const subDropdownToggles = document.querySelectorAll('.sub-dropdown-toggle');
    
    subDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Previne propagarea evenimentului către părinte
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });
    
    // Hero Slider îmbunătățit
    initEnhancedSlider();
    
    // Product Carousel
    const productCarousels = document.querySelectorAll('.product-carousel');
    const carouselPrevs = document.querySelectorAll('.carousel-arrow.prev');
    const carouselNexts = document.querySelectorAll('.carousel-arrow.next');
    
    // Implementăm logica de carousel doar pentru ecrane mici
    function initProductCarousels() {
        if (window.innerWidth <= 992) {
            productCarousels.forEach((carousel, index) => {
                const products = carousel.querySelectorAll('.product-card');
                let currentIndex = 0;
                
                function showProducts() {
                    products.forEach(product => {
                        product.style.display = 'none';
                    });
                    
                    // Arătăm doar produsul curent
                    products[currentIndex].style.display = 'block';
                }
                
                function nextProduct() {
                    currentIndex = (currentIndex + 1) % products.length;
                    showProducts();
                }
                
                function prevProduct() {
                    currentIndex = (currentIndex - 1 + products.length) % products.length;
                    showProducts();
                }
                
                if (carouselPrevs[index] && carouselNexts[index]) {
                    carouselPrevs[index].addEventListener('click', prevProduct);
                    carouselNexts[index].addEventListener('click', nextProduct);
                }
                
                // Inițializăm produsele
                showProducts();
            });
        } else {
            // Resetăm caruselul pentru ecrane mari
            productCarousels.forEach(carousel => {
                const products = carousel.querySelectorAll('.product-card');
                products.forEach(product => {
                    product.style.display = 'block';
                });
            });
        }
    }
    
    // Inițializăm caruselul la încărcarea paginii
    initProductCarousels();
    
    // Reinițializăm la redimensionarea ferestrei
    window.addEventListener('resize', initProductCarousels);
    
    // Quick View Functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            console.log('Quick view for:', productName);
            // Aici ar trebui să implementăm modalul de previzualizare rapidă
        });
    });
    
    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            console.log('Added to cart:', {
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Aici ar trebui să implementăm logica de adăugare în coș
            // și afișarea unei notificări de confirmare
            showNotification(`${productName} a fost adăugat în coș`, 'success');
        });
    });
    
    // Wishlist Functionality
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const productName = this.closest('.product-card').querySelector('.product-name').textContent;
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification(`${productName} a fost adăugat la favorite`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification(`${productName} a fost eliminat de la favorite`, 'info');
            }
        });
    });
    
    // Funcție pentru afișarea notificărilor
    function showNotification(message, type) {
        // Verificăm dacă există deja o notificare
        const existingNotification = document.querySelector('.notification');
        
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Creăm notificarea
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        // Adăugăm notificarea în DOM
        document.body.appendChild(notification);
        
        // Afișăm notificarea (cu o mică întârziere pentru animație)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Adăugăm funcționalitatea butonului de închidere
        const closeButton = notification.querySelector('.close-notification');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                notification.classList.remove('active');
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Ascundem notificarea după 3 secunde
        setTimeout(() => {
            notification.classList.remove('active');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Newsletter form submit
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() !== '') {
                // Aici ar trebui să implementăm logica de abonare la newsletter
                showNotification('Mulțumim pentru abonare! Vei primi periodic noutăți și oferte speciale.', 'success');
                emailInput.value = '';
            }
        });
    });

    // Funcție pentru slider îmbunătățit
    function initEnhancedSlider() {
        const sliderContainer = document.querySelector('.slider-container');
        const slides = document.querySelectorAll('.slider-slide');
        const dots = document.querySelectorAll('.dot');
        const prevArrow = document.querySelector('.slider-arrow.prev');
        const nextArrow = document.querySelector('.slider-arrow.next');
        const arrows = document.querySelectorAll('.slider-arrow');
        
        // Verifică dacă elementele există
        if (!sliderContainer || slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval;
        let isHovering = false;
        
        // Înlocuim butoanele existente cu iconițe de săgeți fără fundal
        if (arrows.length) {
            arrows.forEach(arrow => {
                // Stiluri pentru săgeți
                arrow.style.opacity = '0';
                arrow.style.transition = 'opacity 0.3s ease';
                arrow.style.background = 'none'; // Eliminăm fundalul
                arrow.style.fontSize = '2rem'; // Mărim iconița
                arrow.style.color = 'rgba(255, 255, 255, 0.7)'; // Culoare semi-transparentă pentru iconițe
                
                // Adăugăm hover effect direct pe săgeți
                arrow.addEventListener('mouseenter', function() {
                    this.style.color = 'white'; // Culoare solidă la hover
                });
                
                arrow.addEventListener('mouseleave', function() {
                    this.style.color = 'rgba(255, 255, 255, 0.7)'; // Revenim la semi-transparent
                });
            });
        }
        
        // Afișează un slide specific
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        // Navighează la slide-ul următor
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        // Navighează la slide-ul anterior
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Pornește auto-play-ul
        function startSlideInterval() {
            // Curăță intervalul anterior dacă există
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            
            // Pornește un nou interval de rulare automată
            slideInterval = setInterval(() => {
                if (!isHovering) {
                    nextSlide();
                }
            }, 5000);
        }
        
        // Event listeners pentru hover pe slider
        sliderContainer.addEventListener('mouseenter', function() {
            isHovering = true;
            
            // Afișează butoanele de navigare
            if (arrows.length) {
                arrows.forEach(arrow => {
                    arrow.style.opacity = '1';
                });
            }
        });
        
        sliderContainer.addEventListener('mouseleave', function() {
            isHovering = false;
            
            // Ascunde butoanele de navigare
            if (arrows.length) {
                arrows.forEach(arrow => {
                    arrow.style.opacity = '0';
                });
            }
        });
        
        // Event listeners pentru butoanele de navigare
        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', function() {
                prevSlide();
                // Restart timer
                startSlideInterval();
            });
            
            nextArrow.addEventListener('click', function() {
                nextSlide();
                // Restart timer
                startSlideInterval();
            });
        }
        
        // Event listeners pentru punctele de navigare
        if (dots.length) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    showSlide(index);
                    // Restart timer
                    startSlideInterval();
                });
            });
        }
        
        // Inițializează slider-ul cu primul slide
        showSlide(0);
        
        // Pornește auto-play-ul
        startSlideInterval();
        
        // Adaugă CSS-ul pentru slider
        addSliderStyles();
    }

    // Adaugă stilurile CSS pentru slider direct prin JavaScript
    function addSliderStyles() {
        // Verifică dacă stilurile există deja
        if (document.getElementById('enhanced-slider-styles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'enhanced-slider-styles';
        styleElement.textContent = `
            .slider-container {
                position: relative;
                height: 100%;
                overflow: hidden;
            }
            
            .slider-slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 1s ease;
            }
            
            .slider-slide.active {
                opacity: 1;
            }
            
            .slider-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                border: none;
                font-size: 2rem;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                z-index: 1;
                transition: color 0.3s ease, opacity 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                background: none;
            }
            
            .slider-arrow:hover {
                color: white;
            }
            
            .slider-container:hover .slider-arrow {
                opacity: 1;
            }
            
            .slider-arrow.prev {
                left: 20px;
            }
            
            .slider-arrow.next {
                right: 20px;
            }
            
            .slider-dots {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 1;
            }
            
            .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                transition: background-color 0.3s ease;
                border: none;
            }
            
            .dot.active, .dot:hover {
                background-color: white;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
});