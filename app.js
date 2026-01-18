const app = {
    init: function () {
        this.fetchProducts();
        this.fetchCelebrities();
    },

    fetchProducts: async function () {
        const productList = document.getElementById('product-list');
        if (!productList) return; // Exit if not on product page
        try {
            const response = await fetch('products.json');
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
            const response = await fetch('celebrities.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Celebrities JSON not found");
            const items = await response.json();
            this.renderCelebrities(items);
        } catch (error) {
            console.error("Error loading celebrities:", error);
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

        // Initialize Splide for Celebrities
        new Splide('#splide-celebrities', {
            perPage: 5,
            padding: { left: 10, right: 10 },
            gap: 10,
            arrows: false,
            pagination: false,
            breakpoints: {
                600: { perPage: 4 },
                400: { perPage: 3.5 }
            }
        }).mount();
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
            totalValueEl.innerText = totalValue.toFixed(2) + ' €';
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
            const response = await fetch('alerts.json?v=' + new Date().getTime());
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
            const response = await fetch('just_added.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("Just Added JSON not found");
            const items = await response.json();
            this.renderJustAdded(items, jaContent);
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
                                <span class="ja-price">${item.price.toFixed(2)} €</span>
                                <span class="ja-shop">${item.shop}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ja-actions">
                        <button class="ja-btn ja-btn-add">Save product</button>
                        <a href="${item.link}" target="_blank" class="ja-btn ja-btn-buy">Buy now</a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    },

    renderNotifications: function (alerts, container) {
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
                            The price has dropped to <strong>${alert.currentPrice.toFixed(2)} €</strong>, which is <strong>${discount}%</strong> less than on ${formattedDateSet}!
                        </div>
                        <a href="#" class="action-btn-common buy-now-btn" style="width: auto; margin-top: 5px;">
                            Buy now at ${alert.shop}
                        </a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', item);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
    app.initDropdowns();
    app.initNotifications();
    app.initMenu();
    app.initJustAdded();
});
