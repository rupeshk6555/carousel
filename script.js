const carouselContent = document.querySelector('.carousel-content');
const carouselIndicators = document.querySelector('.carousel-indicators');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const apiUrl = 'https://api.escuelajs.co/api/v1/categories';

let products = [];

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data;
        renderCarousel();
        startAutoSlide();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderCarousel() {
    carouselContent.innerHTML = '';
    carouselIndicators.innerHTML = '';

    const itemsToShow = 16;
    const startIndex = 1;
    const endIndex = startIndex + itemsToShow;

    const visibleProducts = products.slice(startIndex, endIndex);

    visibleProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');

        // Create an image element
        const image = document.createElement('img');
        image.src = product.image; // Assuming the product object has an "image" property with the image URL
        image.alt = product.name; // Assuming the product object has a "name" property
        item.appendChild(image);

        carouselContent.appendChild(item);

        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicator.addEventListener('click', () => {
            jumpToSlide(index);
        });
        carouselIndicators.appendChild(indicator);
    });

    setActiveIndicator(0);
}



// Move the carousel to the specified slide
function moveToSlide(index) {
    const itemWidth = carouselContent.querySelector('.carousel-item').offsetWidth;
    carouselContent.style.transform = `translateX(-${itemWidth * index}px)`;
    setActiveIndicator(index);
}

// Jump to the specified slide
function jumpToSlide(index) {
    stopAutoSlide();
    moveToSlide(index);
}

// Move to the next slide
function nextSlide() {
    const currentIndex = getCurrentSlideIndex();
    const nextIndex = (currentIndex + 1) % products.length;
    moveToSlide(nextIndex);
}

// Move to the previous slide
function prevSlide() {
    const currentIndex = getCurrentSlideIndex();
    const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    moveToSlide(prevIndex);
}

// Get the index of the currently active slide
function getCurrentSlideIndex() {
    const itemWidth = carouselContent.querySelector('.carousel-item').offsetWidth;
    const transformValue = carouselContent.style.transform;
    const translateX = transformValue ? parseInt(transformValue.match(/-?\d+/)[0]) : 0;
    return Math.abs(translateX) / itemWidth;
}

// Set the active indicator
function setActiveIndicator(index) {
    const indicators = Array.from(carouselIndicators.children);
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// Auto slide the carousel every 3 seconds
let autoSlideInterval;
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
}

// Stop the auto sliding
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Event listeners for buttons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Fetch products when the page loads
fetchProducts();