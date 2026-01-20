const app = {
    init: function () {
        this.fetchProducts();
        this.fetchShops();
        this.fetchCelebrities();
        this.fetchCelebritiesSidebar();
        this.fetchShopCategories();
        this.fetchFaqs(); // Load FAQs
        this.initCelebritiesMobileEvents(); // star watch mobile overlay
        this.bindLogoutEvents(); // Add logout listener
    },

    bindLogoutEvents: function () {
        // Open Modal triggers
        const logoutLinks = document.querySelectorAll('.menu-link-logout');
        const logoutModal = document.getElementById('logout-modal');
        const body = document.body;

        if (logoutLinks.length > 0 && logoutModal) {
            logoutLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close other menus if open
                    document.getElementById('menu-modal')?.classList.remove('active');
                    document.getElementById('menu-overlay')?.classList.remove('active');

                    // Show Logout Modal
                    logoutModal.classList.add('active');
                    body.style.overflow = 'hidden'; // Prevent background scrolling
                });
            });
        }

        // Close Logic
        const closeBtn = document.getElementById('logout-close');
        const loginAgainBtn = document.getElementById('logout-login-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                logoutModal.classList.remove('active');
                body.style.overflow = '';
            });
        }

        if (loginAgainBtn) {
            loginAgainBtn.addEventListener('click', () => {
                // Action: Redirect to landing page or just close and reload
                window.location.href = 'index.html';
            });
        }

        // Close on click outside (optional, but good UX)
        if (logoutModal) {
            logoutModal.addEventListener('click', (e) => {
                if (e.target === logoutModal) {
                    logoutModal.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        }
    },

    fetchProducts: async function () {
        const productList = document.getElementById('product-list');
        if (!productList) return; // Exit if not on product page
        try {
            const response = await fetch('json-files/products.json');
            if (!response.ok) throw new Error("JSON not found");
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error("Error:", error);
            productList.innerHTML = `<p style="padding: 20px; color: red;">Error loading products.</p>`;
        }
    },

    fetchCelebrities: async function () {
        if (!document.getElementById('splide-celebrities')) return;
        try {
            const response = await fetch('json-files/celebrities.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Celebrities JSON not found");
            const items = await response.json();
            this.renderCelebrities(items);
        } catch (error) {
            console.error("Error loading celebrities:", error);
        }
    },

    fetchShops: async function () {
        if (!document.getElementById('splide-shops')) return;
        try {
            const response = await fetch('json-files/shops.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Shops JSON not found");
            const items = await response.json();
            this.renderShops(items);
        } catch (error) {
            console.error("Error loading shops:", error);
        }
    },

    renderShops: function (items) {
        const list = document.getElementById('shops-list');
        if (!list) return;
        list.innerHTML = '';

        items.forEach(shop => {
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${shop.shop}&sz=32`;
            const html = `
                <li class="splide__slide shop-slide">
                    <div class="shop-card">
                        <img src="${faviconUrl}" alt="${shop.shop}">
                        <span class="shop-name">${shop.shop}</span>
                    </div>
                </li>
            `;
            list.insertAdjacentHTML('beforeend', html);
        });

        new Splide('#splide-shops', {
            type: 'loop', // Infinite loop
            perPage: 4,
            gap: '1rem',
            pagination: false,
            arrows: true,
            breakpoints: {
                600: { perPage: 2 },
            }
        }).mount();
    },

    // SVG Map for Categories
    categoryIcons: {
        "18+": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>', // Exclamation in circle
        "Alcohol": '<svg viewBox="0 0 24 24"><path d="M6 3v6c0 2.97 2.16 5.43 5 5.91V19H8v2h8v-2h-3v-4.09c2.84-.48 5-2.94 5-5.91V3H6zm10 6c0 2.21-1.79 4-4 4s-4-1.79-4-4V5h8v4z" fill="currentColor"/></svg>', // Standard Wine Glass
        "Automotive": '<svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/></svg>',
        "Beauty": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', // Heart
        "Books": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>', // Lucide Library
        "Clothing": '<svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v10z" fill="currentColor"/></svg>',
        "DIY": '<svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/></svg>',
        "Electronics": '<svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor"/></svg>',
        "Footwear": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>', // Footprints
        "Furniture": '<svg viewBox="0 0 24 24"><path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1v-1h14v1h1l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z" fill="currentColor"/></svg>',
        "Grocery": '<svg viewBox="0 0 24 24"><path d="M22 9h-4.79l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.02.17.06.25l3.65 10.65C4.94 21.6 5.61 22 6.34 22h11.32c.73 0 1.4-.4 1.63-1.1l3.65-10.65c.04-.08.06-.16.06-.25 0-.55-.45-1-1-1zm-9 0H8.84L12 4.26 15.16 9h-4.16z" fill="currentColor"/></svg>',
        "Home": '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>',
        "Kids": '<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/></svg>',
        "Marketplace": '<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v9z" fill="currentColor"/></svg>', // Storefront with awning
        "Nutrition": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="4.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="5" cy="19.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="19.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="7" x2="12" y2="9.5" stroke="currentColor" stroke-width="2"/><line x1="10" y1="13.5" x2="6.5" y2="17.5" stroke="currentColor" stroke-width="2"/><line x1="14" y1="13.5" x2="17.5" y2="17.5" stroke="currentColor" stroke-width="2"/></svg>', // Molecule structure
        "Optics": '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></svg>',
        "Pets": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none"/><path d="M9 13.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5S14.43 10 12.5 10 9 11.57 9 13.5zM6 7c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm9 0c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zM3 13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm14 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="currentColor"/></svg>', // Paw Print
        "Pharmacy": '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" fill="currentColor"/></svg>',
        "Second Hand": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
        "Sports": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg>', // Lucide Dumbbell
    },

    fetchShopCategories: async function () {
        if (!document.getElementById('splide-categories')) return;
        try {
            const response = await fetch('json-files/shop_categories.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Categories JSON not found");
            const items = await response.json();
            // items.sort((a, b) => a.name.localeCompare(b.name));
            this.renderShopCategories(items);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    },

    renderShopCategories: function (items) {
        const list = document.getElementById('categories-list');
        if (!list) return;
        list.innerHTML = '';

        items.forEach((item, index) => {
            const icon = this.categoryIcons[item.name] || this.categoryIcons["Beauty"]; // Fallback
            const html = `
                <li class="splide__slide">
                    <button class="category-filter-btn ${index === 0 ? 'active' : ''}" data-category="${item.name}">
                        ${icon}
                        ${item.name}
                    </button>
                </li>
            `;
            list.insertAdjacentHTML('beforeend', html);
        });

        // Init Filter Carousel
        new Splide('#splide-categories', {
            type: 'loop', // Endless loop
            autoWidth: true,
            pagination: false,
            arrows: false,
            focus: 0, // Focus on first, prevent random jump
            trimSpace: false, // Allow sliding naturally
            gap: '10px',
        }).mount();

        // Bind Click Events
        const buttons = document.querySelectorAll('.category-filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Toggle Active State
                document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Load Products
                const category = btn.getAttribute('data-category');
                this.loadCategoryProducts(category);
            });
        });

        // Load initial products (first category)
        if (items.length > 0) {
            this.loadCategoryProducts(items[0].name);
        }
    },

    loadCategoryProducts: async function (category) {
        const list = document.getElementById('category-products-list');
        if (!list) return;

        // Fetch just_added.json if not already cached (could add caching here, but fetch is fast enough for now)
        try {
            const response = await fetch('json-files/just_added.json?v=' + new Date().getTime());
            const allProducts = await response.json();

            // 1. Filter matches
            let matches = allProducts.filter(p => p.shop_category === category);

            // 2. Fill if < 10
            let displayProducts = [...matches];
            if (displayProducts.length < 10) {
                const others = allProducts.filter(p => p.shop_category !== category);
                // Shuffle others
                const shuffled = others.sort(() => 0.5 - Math.random());
                const needed = 10 - displayProducts.length;
                displayProducts = displayProducts.concat(shuffled.slice(0, needed));
            } else {
                displayProducts = displayProducts.slice(0, 10);
            }

            // 3. Render
            list.innerHTML = ''; // Clear prev
            displayProducts.forEach(p => {
                const html = `
                    <li class="splide__slide">
                        <div class="cat-product-card">
                            <a href="${p.link}" class="cat-product-image-link">
                                <div class="cat-product-image-wrap">
                                    <img src="${p.image}" alt="${p.title}">
                                </div>
                            </a>
                            <div class="cat-product-info">
                                <h4 class="cat-product-title">${p.title}</h4>
                                <div class="cat-product-price" style="display:none;">${p.price.toFixed(2)} &euro;</div>
                                <button class="alert-set-btn" style="margin-top: auto; width: 100%; justify-content: center;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Save product
                                </button>
                            </div>
                        </div>
                    </li>
                `;
                list.insertAdjacentHTML('beforeend', html);
            });

            // 4. Init/Refresh Carousel
            // Splide needs to be re-initialized or updated if element exists. 
            // Simpler to destroy old one if we tracked it, but here we might just init.
            // CAUTION: Initializing on same element twice causes issues. 
            // Better to check if existing instance on this ID? 
            // In simple implementation, we can target the ID.

            if (this.productCarousel) {
                this.productCarousel.destroy();
            }

            this.productCarousel = new Splide('#splide-category-products', {
                perPage: 3,
                gap: '10px',
                pagination: false,
                arrows: false, // As per instruction "no arrows" for filters, possibly for products user didn't specify but carousel suggests arrows usually? User requested "squared images".
                // I will add arrows: false for consistency as swipe is primary on mobile
                breakpoints: {
                    600: { perPage: 2 },
                    400: { perPage: 2 }
                }
            });
            this.productCarousel.mount();

        } catch (error) {
            console.error("Error loading category products", error);
        }
    },

    renderCelebrities: function (items) {
        const list = document.getElementById('celebrities-list');
        if (!list) return;
        list.innerHTML = '';

        items.forEach(c => {
            const html = `
                <li class="splide__slide">
                    <div class="celebrity-card">
                        <div class="celebrity-avatar-wrapper">
                            <img src="${c.avatar}" alt="${c.nickname}" class="celebrity-avatar">
                            ${c.isVerified ? '<div class="verified-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>' : ''}
                        </div>
                        <div class="celebrity-nickname">${c.nickname}</div>
                    </div>
                </li>
            `;
            list.insertAdjacentHTML('beforeend', html);
        });

        new Splide('#splide-celebrities', {
            type: 'loop', // Infinite loop
            perPage: 5,
            gap: '1rem',
            arrows: true, // Kept enabled per request
            pagination: false,
            breakpoints: {
                600: { perPage: 4 },
            }
        }).mount();
    },

    initCelebritiesMobileEvents: function () {
        const starWatchLink = document.getElementById('menu-link-star-watch');
        const sidebar = document.getElementById('celebrities-sidebar');
        const overlay = document.getElementById('celebrities-overlay');
        const closeBtn = document.getElementById('celebrities-close');

        const openSidebar = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (sidebar) sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');

            // Close Menu if open
            const menuModal = document.getElementById('menu-modal');
            const menuOverlay = document.getElementById('menu-overlay');
            if (menuModal && menuModal.classList.contains('active')) {
                menuModal.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
            }
        };

        const closeSidebar = () => {
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        };

        if (starWatchLink) starWatchLink.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);
    },

    fetchCelebritiesSidebar: async function () {
        const container = document.getElementById('celebrities-sidebar-content');
        if (!container) return;
        try {
            const response = await fetch('json-files/celebrities.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Celebrities JSON not found");
            const items = await response.json();
            this.renderCelebritiesSidebar(items);
        } catch (error) {
            console.error("Error loading celebrities sidebar:", error);
        }
    },

    renderCelebritiesSidebar: function (items) {
        const container = document.getElementById('celebrities-sidebar-content');
        if (!container) return;
        container.innerHTML = '';

        items.forEach(c => {
            const fullname = c.nickname.replace(/_/g, ' ').replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const html = `
                <div class="celeb-card-sidebar">
                    <div class="celeb-avatar-sidebar-wrapper">
                        <img src="${c.avatar}" alt="${c.nickname}" class="celeb-avatar-sidebar">
                        ${c.isVerified ? '<div class="celeb-verified-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>' : ''}
                    </div>
                    <div class="celeb-nickname-sidebar">@${c.nickname}</div>
                    <div class="celeb-fullname-sidebar">${fullname}</div>
                    
                    <button class="celeb-btn-follow">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Follow
                    </button>
                    <a href="#" class="celeb-btn-view">View products (${Math.floor(Math.random() * (20 - 3 + 1)) + 3})</a>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    },

    renderProducts: function (products) {
        const container = document.getElementById('product-list');
        container.innerHTML = '';

        products.forEach(p => {
            let domain = "";
            try {
                domain = new URL(p.link).hostname;
            } catch (e) {
                domain = p.link.replace('https://', '').replace('http://', '').split('/')[0];
            }

            // Price Alert Button Logic
            let priceAlertBtn = '';
            if (p.hasAlert) {
                // Active Alert: Filled Bell, Price is Link, Icon X
                priceAlertBtn = `
                <button class="action-btn-common alert-active-btn">
                    <div style="display: flex; align-items: center; gap: 4px; width: 100%; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="16" height="16" style="color: #336ae9;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/></svg>
                        <span style="font-weight:normal; color: #336ae9; cursor: pointer;">${p.alert_price}</span>
                    </div>
                </button>`;
            } else {
                // Set Alert: Outline Bell, Border color icon, Text pink
                priceAlertBtn = `
                <button class="action-btn-common alert-set-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="color: #336ae9;"><path d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2zm11-2v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4c0-1.1.9-2 2-2s2 .9 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2zm-4-8c0-2.76-2.24-5-5-5s-5 2.24-5 5v7h10v-7z" fill="currentColor"/></svg>
                    <span style="color: #336ae9;">Set price alert</span>
                </button>`;
            }

            const card = `
            <article class="product-card">
                
                <!-- Left Column -->
                <div class="product-left-col">
                    <div class="product-image-container" style="position: relative;">
                        ${(() => {
                    if (p.old_price) {
                        try {
                            const priceVal = parseFloat(p.price.replace(/[^\d.]/g, ''));
                            const oldPriceVal = parseFloat(p.old_price.replace(/[^\d.]/g, ''));
                            if (oldPriceVal > priceVal) {
                                const discount = Math.round((1 - priceVal / oldPriceVal) * 100);
                                return `<span class="discount-badge">-${discount}%</span>`;
                            }
                        } catch (e) { }
                    }
                    return '';
                })()}
                        <img src="${p.image}" alt="${p.title}" class="product-img">
                    </div>
                    
                    <div class="product-brand">
                        ${p.brand || 'Samsung Galaxy'}
                    </div>
                    
                    <div class="product-price-block">
                        <div class="product-price ${p.old_price ? 'discounted' : ''}">${p.price}</div>
                        ${p.old_price ? `<div class="product-old-price">${p.old_price}</div>` : ''}
                    </div>

                    <div style="width: 100%; margin-top: auto;">
                        ${priceAlertBtn}

                        <a href="${p.link}" target="_blank" class="action-btn-common buy-now-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/></svg>
                            Buy now
                        </a>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="product-right-col">
                    <div>
                        <h3 class="product-title">${p.title}</h3>
                        
                        <div class="separator-line"></div>
                        <div class="actions-label">Actions:</div>

                        <ul class="product-actions">
                            <li>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                                Price history
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L1 7v2h2.5c.35 3.63 2.5 6.64 6 7.42V20h-1.5v2h8v-2h-1.5v-3.58c3.5-.78 5.65-3.79 6-7.42H22V7L12 2zm-5.5 8c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3zm11 0c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z" fill="currentColor"/></svg>
                                Compare prices (4)
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66 0 1.61 1.34 2.92 3 2.92s3-1.31 3-2.92c0-1.61-1.34-2.92-3-2.92z" fill="currentColor"/></svg>
                                Share with friends
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                                Remove product
                            </li>
                        </ul>
                    </div>

                    <a href="${p.link}" target="_blank" class="action-btn-common shop-link-btn" style="margin-top: auto;">
                        <img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" class="shop-icon" onerror="this.src='https://via.placeholder.com/20?text=S'">
                        ${p.shop_name}
                    </a>
                </div>
            </article>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });

        const totalCounter = document.getElementById('total-products');
        if (totalCounter) totalCounter.innerText = products.length;

        // Calculate total value
        const totalValue = products.reduce((sum, p) => {
            try {
                const priceVal = parseFloat(p.price.replace(/[^\d.]/g, ''));
                return sum + (isNaN(priceVal) ? 0 : priceVal);
            } catch (e) {
                return sum;
            }
        }, 0);

        const totalValueEl = document.getElementById('total-value');
        if (totalValueEl) {
            totalValueEl.innerHTML = totalValue.toFixed(2) + ' &euro;';
        }
    },

    initDropdowns: function () {
        // Profile Dropdown Toggle
        const profileWrapper = document.querySelector('.user-profile');
        const profileDropdown = document.querySelector('.profile-dropdown');

        if (profileWrapper && profileDropdown) {
            profileWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Close when clicking outside
            document.addEventListener('click', () => {
                profileDropdown.style.display = 'none';
            });
        }

        // Sort Dropdown Toggle with Arrow
        const sortWrapper = document.querySelector('.sort-dropdown-wrapper');
        const sortSelected = document.getElementById('sort-selected');
        const sortMenu = document.getElementById('sort-dropdown-menu');
        const sortArrow = document.getElementById('sort-arrow');

        if (sortWrapper && sortSelected && sortMenu) {
            sortSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                sortWrapper.classList.toggle('active');
            });

            // Handle selection
            sortMenu.querySelectorAll('a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const value = item.getAttribute('data-value');
                    const text = item.textContent;

                    // Update text
                    sortSelected.childNodes[0].textContent = text + ' ';

                    // Update arrow direction
                    if (sortArrow) {
                        if (value === 'price_desc') {
                            // Up arrow for high to low
                            sortArrow.innerHTML = '<path d="M7 14l5-5 5 5z" fill="currentColor"/>';
                        } else {
                            // Down arrow for low to high
                            sortArrow.innerHTML = '<path d="M7 10l5 5 5-5z" fill="currentColor"/>';
                        }
                    }

                    sortWrapper.classList.remove('active');
                });
            });

            // Close when clicking outside
            document.addEventListener('click', () => {
                sortWrapper.classList.remove('active');
            });
        }
    },

    initMenu: function () {
        const menuBtn = document.querySelector('.menu-btn');
        const menuModal = document.getElementById('menu-modal');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuClose = document.getElementById('menu-close');

        const toggleMenu = () => {
            if (menuModal) menuModal.classList.toggle('active');
            if (menuOverlay) menuOverlay.classList.toggle('active');
        };

        const closeMenu = () => {
            if (menuModal) menuModal.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
        };

        if (menuBtn) menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        if (menuClose) menuClose.addEventListener('click', closeMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

        // Notifications link handler
        const notificationsLink = document.getElementById('menu-link-notifications');
        if (notificationsLink) {
            notificationsLink.addEventListener('click', (e) => {
                e.preventDefault();
                closeMenu(); // Close the menu

                // Open notifications modal
                const notifModal = document.getElementById('notifications-modal');
                const notifOverlay = document.getElementById('notifications-overlay');
                if (notifModal) notifModal.classList.add('active');
                if (notifOverlay) notifOverlay.classList.add('active');
            });
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    },

    initNotifications: async function () {
        const bellIcon = document.querySelector('.notification-icon');
        const modal = document.getElementById('notifications-modal');
        const overlay = document.getElementById('notifications-overlay');
        const closeBtn = document.getElementById('notifications-close');
        const content = document.getElementById('notifications-content');
        const badge = document.querySelector('.notification-icon .badge');

        // Fetch and render notifications
        try {
            const response = await fetch('json-files/alerts.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Alerts JSON not found");
            const alerts = await response.json();
            this.renderNotifications(alerts, content);

            // Update badge count
            if (badge) {
                badge.textContent = alerts.length;
            }
        } catch (error) {
            console.error("Error loading notifications:", error);
            content.innerHTML = '<p style="padding: 20px; color: var(--text-light);">No notifications available.</p>';
            if (badge) {
                badge.textContent = '0';
            }
        }

        // Toggle modal
        if (bellIcon) {
            bellIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);
    },

    initJustAdded: async function () {
        const jaBtn = document.getElementById('just-added-btn');
        const jaLink = document.getElementById('menu-link-just-added');
        const jaSidebar = document.getElementById('just-added-sidebar');
        const jaOverlay = document.getElementById('just-added-overlay');
        const jaClose = document.getElementById('just-added-close');
        const jaContent = document.getElementById('just-added-content');

        const openJa = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // If mobile (check by class or media query, but toggling class is safe)
            if (jaSidebar) jaSidebar.classList.add('active');
            if (jaOverlay) jaOverlay.classList.add('active');

            // If opened via menu, close menu
            const menuModal = document.getElementById('menu-modal');
            const menuOverlay = document.getElementById('menu-overlay');
            if (menuModal && menuModal.classList.contains('active')) {
                menuModal.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
            }
        };

        const closeJa = () => {
            if (jaSidebar) jaSidebar.classList.remove('active');
            if (jaOverlay) jaOverlay.classList.remove('active');
        };

        if (jaBtn) jaBtn.addEventListener('click', openJa);
        if (jaLink) jaLink.addEventListener('click', openJa);
        if (jaClose) jaClose.addEventListener('click', closeJa);
        if (jaOverlay) jaOverlay.addEventListener('click', closeJa);

        // Fetch Data
        try {
            const response = await fetch('json-files/just_added.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Just Added JSON not found");
            const items = await response.json();

            // Randomize and take 10
            const shuffled = items.sort(() => 0.5 - Math.random());
            const selectedItems = shuffled.slice(0, 10);

            this.renderJustAdded(selectedItems, jaContent);
        } catch (error) {
            console.error("Error loading Just Added:", error);
            if (jaContent) jaContent.innerHTML = '<p style="padding:15px; text-align:center; color:#999;">Failed to load items.</p>';
        }
    },

    renderJustAdded: function (items, container) {
        if (!container) return;
        container.innerHTML = '';

        items.forEach(item => {
            // Time Ago Calculation
            const addedDate = new Date(item.dateAdded);
            const now = new Date(); // User said always use today's date to calculate
            // Assume input dates are valid ISO strings

            const diffMs = now - addedDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHrs = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHrs / 24);

            let timeAgo = '';
            if (diffDays > 0) timeAgo = `${diffDays}d ago`;
            else if (diffHrs > 0) timeAgo = `${diffHrs}h ago`;
            else if (diffMins > 0) timeAgo = `${diffMins}m ago`;
            else timeAgo = 'Just now';

            const html = `
                <div class="ja-item">
                    <div class="ja-header">
                        <img src="${item.userAvatar}" alt="${item.username}" class="ja-avatar">
                        <span class="ja-username">${item.username}</span>
                        <span class="ja-time">${timeAgo}</span>
                    </div>
                    <div class="ja-body">
                        <img src="${item.image}" alt="${item.title}" class="ja-image">
                        <div class="ja-details">
                            <div class="ja-title">${item.title}</div>
                            <div class="ja-price-row">
                                <span class="ja-price">${item.price.toFixed(2)} &euro;</span>
                                <span class="ja-shop">${item.shop}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ja-actions">
                        <button class="ja-btn ja-btn-add">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Save product
                        </button>
                        <a href="${item.link}" target="_blank" class="ja-btn ja-btn-buy">Buy now</a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    },

    renderNotifications: function (alerts, container) {
        if (!container) return;
        container.innerHTML = '';

        alerts.forEach(alert => {
            // Calculate discount percentage
            const discount = Math.round(((alert.initialPrice - alert.currentPrice) / alert.initialPrice) * 100);

            // Format date from YYYY-MM-DD to DD.MM.YYYY (target reached)
            const dateParts = alert.date.split('-');
            const formattedDateReached = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

            // Format set date
            let formattedDateSet = formattedDateReached; // Fallback
            if (alert.dateSet) {
                const dateSetParts = alert.dateSet.split('-');
                formattedDateSet = `${dateSetParts[2]}.${dateSetParts[1]}.${dateSetParts[0]}`;
            }

            const item = `
                <div class="notification-item">
                    <div class="notification-icon">
                        <div class="notification-sent-date">
                            ${formattedDateReached}<br>
                            ${alert.timeReached}
                        </div>
                        <img src="${alert.image}" alt="${alert.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    </div>
                    <div class="notification-body">
                        <div class="notification-message">
                            Your price target has been reached for the <strong>${alert.title}</strong>, <strong>${alert.brand}</strong> at <strong>${alert.shop}</strong>.<br>
                            The price has dropped to <strong>${alert.currentPrice.toFixed(2)} &euro;</strong>, which is <strong>${discount}%</strong> less than on ${formattedDateSet}!
                        </div>
                        <a href="#" class="action-btn-common buy-now-btn" style="width: auto; margin-top: 5px;">
                            Buy now at ${alert.shop}
                        </a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', item);
        });
    },

    fetchFaqs: async function () {
        const faqList = document.getElementById('faq-list');
        if (!faqList) return;
        try {
            const response = await fetch('json-files/faqs.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("FAQs JSON not found");
            const items = await response.json();
            this.renderFaqs(items);
        } catch (error) {
            console.error("Error loading FAQs:", error);
        }
    },

    renderFaqs: function (items) {
        const list = document.getElementById('faq-list');
        const viewAllBtn = document.getElementById('view-all-faq');
        if (!list) return;
        list.innerHTML = '';

        items.forEach((faq, index) => {
            const isHidden = index >= 3 ? 'hidden' : '';
            const html = `
                <div class="faq-item ${isHidden}">
                    <button class="faq-question">
                        <span>${faq.question}</span>
                        <span class="faq-icon"></span>
                    </button>
                    <div class="faq-answer">
                        <p>${faq.answer}</p>
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', html);
        });

        // Add Toggle logic
        const faqs = list.querySelectorAll('.faq-item');
        faqs.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close others
                faqs.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });

        // "View All" Logic
        if (items.length > 3 && viewAllBtn) {
            viewAllBtn.style.display = 'inline-flex';
            viewAllBtn.addEventListener('click', () => {
                list.querySelectorAll('.faq-item.hidden').forEach(el => el.classList.remove('hidden'));
                viewAllBtn.style.display = 'none';
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
    app.initDropdowns();
    app.initNotifications();
    app.initMenu();
    app.initJustAdded();
});

