const app = {
    init: function() {
        this.fetchProducts();
    },

    fetchProducts: async function() {
        const productList = document.getElementById('product-list');
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error("JSON not found");
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error("Грешка:", error);
            if (productList) {
                productList.innerHTML = `<p class="error-msg">Грешка при зареждане на продуктите.</p>`;
            }
        }
    },

    renderProducts: function(products) {
        const container = document.getElementById('product-list');
        if (!container) return;
        container.innerHTML = ''; 

        products.forEach(p => {
            let domain = "";
            try {
                domain = new URL(p.link).hostname;
            } catch (e) {
                domain = p.link ? p.link.replace('https://', '').replace('http://', '').split('/')[0] : "";
            }

            const alertHtml = p.hasAlert ? `
                <div class="alert-box-inline">
                    <div class="alert-content">
                        <span><span class="pink-text">🔔</span> Price alert: <strong>${p.alert_price}</strong></span>
                        <span class="alert-details-link">Details</span>
                    </div>
                </div>` : '';

            const card = `
            <article class="product-card">
                <div class="delete-trigger">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                </div>

                <div class="product-left-col">
                    <img src="${p.image}" alt="${p.title}" class="card-img">
                    <div class="card-brand">${p.brand || 'Samsung Galaxy'}</div>
                    <div class="card-price">${p.price}</div>
                    ${p.old_price ? `<div class="card-price-old">${p.old_price}</div>` : ''}
                </div>

                <div class="product-right-col">
                    <h3 class="card-title">${p.title}</h3>
                    
                    <a href="${p.link}" target="_blank" class="buy-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/></svg>
                        Купи продукта
                    </a>

                    <ul class="card-actions-list">
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                            Create price alert
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                            View price history
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66 0 1.61 1.34 2.92 3 2.92s3-1.31 3-2.92c0-1.61-1.34-2.92-3-2.92z" fill="currentColor"/></svg>
                            Share with a friend
                        </li>
                    </ul>

                    ${alertHtml}

                    <a href="${p.link}" class="shop-badge-link" target="_blank">
                        <img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" class="shop-badge-icon" onerror="this.src='https://via.placeholder.com/20?text=S'">
                        <span>${p.shop_name}</span>
                    </a>
                </div>
            </article>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });

        const totalCounter = document.getElementById('total-products');
        if (totalCounter) totalCounter.innerText = products.length;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
