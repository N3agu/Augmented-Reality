document.addEventListener('DOMContentLoaded', () => {
    const dishes = {
        1: {
            name: 'Burger "Epicurean"',
            price: 58.00,
            model: 'models/Hamburger.glb',
            poster: 'images/hamburger.jpg',
            specs: {
                'Ingrediente principale': 'Carne de vită Angus, brânză cheddar maturată, ceapă caramelizată, castraveți murați, sos special',
                'Gramaj': 'Aprox. 450g',
                'Alergeni': 'Gluten, Lactoză, Muștar',
                'Recomandarea bucătarului': 'Servit cu cartofi prăjiți cu parmezan și usturoi.'
            }
        },
        2: {
            name: 'Hotdog "New York"',
            price: 42.00,
            model: 'models/HotDog.glb',
            poster: 'images/hotdog.jpg',
            specs: {
                'Ingrediente principale': 'Cârnat de vită, chiflă pufoasă, muștar, ketchup, ceapă prăjită',
                'Gramaj': 'Aprox. 300g',
                'Alergeni': 'Gluten, Muștar',
                'Recomandarea bucătarului': 'Servit cu cartofi prăjiți clasici și un castravete murat.'
            }
        },
        3: {
            name: 'Donuts "Sweet Delight"',
            price: 25.00,
            model: 'models/Donuts.glb',
            poster: 'images/donuts.jpg',
            specs: {
                'Ingrediente principale': 'Făină, zahăr, ouă, lapte, glazură de ciocolată',
                'Gramaj': 'Aprox. 150g',
                'Alergeni': 'Gluten, Ouă, Lactoză',
                'Recomandarea bucătarului': 'Se savurează proaspăt glazurate, cu o cafea sau un cappuccino.'
            }
        },
        4: {
            name: 'Caffee Latte',
            price: 12.00,
            model: 'models/CaffeLatte.glb',
            poster: 'images/latte.jpg',
            specs: {
                'Ingrediente principale': 'Cafea espresso, lapte proaspăt, spumă de lapte',
                'Gramaj': 'Aprox. 250ml',
                'Alergeni': 'Lactoză',
                'Recomandarea bucătarului': 'Savurează-l cald, alături de un croissant proaspăt.'
            }
        }
    };

    const initPage = () => {
        updateCartCount();
        if (document.getElementById('product-details')) {
            loadProductDetails();
        }
        if (document.getElementById('cart-items-container')) {
            loadCartItems();
        }
        
        initHamburgerMenu();
    };
    
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
    
    const updateCartCount = () => {
        const cart = getCart();
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => el.textContent = cart.length);
    };

    const loadProductDetails = () => {
        const params = new URLSearchParams(window.location.search);
        const dishId = params.get('id');
        const dish = dishes[dishId];

        if (!dish) {
            document.getElementById('product-details').innerHTML = '<p>Preparatul nu a fost găsit.</p>';
            return;
        }

        document.title = `${dish.name} - 3Dine`;

        const specsHtml = Object.entries(dish.specs)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('');

        const productDetailsContainer = document.getElementById('product-details');
        // Restoring the two-column grid structure
        productDetailsContainer.innerHTML = `
            <div class="model-viewer-container">
                <model-viewer id="product-viewer" src="${dish.model}" ar ar-modes="webxr scene-viewer quick-look" camera-controls touch-action="pan-y" alt="Model 3D al ${dish.name}" shadow-intensity="1">
                </model-viewer>
            </div>

            <div class="product-info-layout">
                <div class="product-specs">
                    <h1>${dish.name}</h1>
                    <p class="price">${dish.price.toFixed(2)} RON</p>
                    <h2>Detalii Preparat</h2>
                    <ul>${specsHtml}</ul>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" data-id="${dishId}">Adaugă în Comandă</button>
                </div>
            </div>
        `;

        // --- Event listener logic ---
        document.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            addToCart(id);
        });
    };

    const addToCart = (dishId) => {
        const cart = getCart();
        const dish = dishes[dishId];
        if (dish) {
            cart.push({ id: dishId, name: dish.name, price: dish.price });
            saveCart(cart);
            updateCartCount();
            alert(`${dish.name} a fost adăugat în comandă!`);
        }
    };

    const loadCartItems = () => {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        const totalElement = document.getElementById('cart-total');
        const summaryContainer = document.getElementById('cart-summary');

        if (cart.length === 0) {
            container.innerHTML = '<p>Comanda ta este goală.</p>';
            summaryContainer.style.display = 'none';
            return;
        }
        
        summaryContainer.style.display = 'block';
        container.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                </div>
                <div class="cart-item-price">
                    <p>${item.price.toFixed(2)} RON</p>
                </div>
            `;
            container.appendChild(itemElement);
            total += item.price;
        });

        totalElement.textContent = `${total.toFixed(2)} RON`;

        document.getElementById('clear-cart-btn').addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să golești comanda?')) {
                localStorage.removeItem('cart');
                loadCartItems();
                updateCartCount();
            }
        });
    };

    const initHamburgerMenu = () => {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenuBtn = document.getElementById('close-menu-btn');

        if (hamburgerBtn && mobileMenu && closeMenuBtn) {
            hamburgerBtn.addEventListener('click', () => {
                mobileMenu.classList.add('show');
            });

            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
            });
            
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('show');
                });
            });
        }
    };
    
    initPage();
});