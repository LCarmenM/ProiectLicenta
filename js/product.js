document.addEventListener('DOMContentLoaded', function() {
    // Product image gallery
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                const imageUrl = this.querySelector('img').getAttribute('data-image');
                mainImage.src = imageUrl;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Thumbnail navigation
        const prevBtn = document.querySelector('.thumbnail-nav.prev');
        const nextBtn = document.querySelector('.thumbnail-nav.next');
        const thumbnailsContainer = document.querySelector('.thumbnails');
        
        if (prevBtn && nextBtn && thumbnailsContainer) {
            prevBtn.addEventListener('click', function() {
                thumbnailsContainer.scrollBy({
                    left: -100,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', function() {
                thumbnailsContainer.scrollBy({
                    left: 100,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // In a real app, this would update product info based on color
                const colorName = this.getAttribute('data-color');
                console.log('Selected color:', colorName);
            });
        });
    }
    
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // In a real app, this would update product info based on size
                const sizeName = this.getAttribute('data-size');
                console.log('Selected size:', sizeName);
            });
        });
    }
    
    // Add to cart functionality
    const addToCartBtn = document.getElementById('addToCart');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get selected options
            const selectedColor = document.querySelector('.color-option.selected')?.getAttribute('data-color') || 'negru';
            const selectedSize = document.querySelector('.size-option.selected')?.getAttribute('data-size') || 'M';
            
            // In a real app, this would add the product to the cart
            console.log('Adding to cart:', {
                id: 'rochie-midi-seara',
                name: 'Rochie midi de seară',
                price: 500,
                color: selectedColor,
                size: selectedSize,
                quantity: 1
            });
            
            // Show cart sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
});