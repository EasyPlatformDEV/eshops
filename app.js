const app = {
    init: function () {
        this.fetchProducts();
    },

    fetchProducts: async function () {
        const productList = document.getElementById('product-list');
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error("JSON not found");
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error("Грешка:", error);
            productList.innerHTML = `<p style="padding: 20px; color: red;">Грешка при зареждане на продуктите.</p>`;
        }
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

            const alertHtml = p.hasAlert ? `
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                        <span><span style="color: #e83e8c;">🔔</span> Price alert: <strong>${p.alert_price}</strong></span>
                        <span style="color: #e83e8c; text-decoration: underline; cursor: pointer;">Details</span>
                    </div>
                </div>` : '';

            const card = `
            <article class="product-card">
                <div class="product-image-container">
                    <img src="${p.image}" alt="${p.title}" class="product-img">
                </div>

                <div class="product-info">
                    <h3 class="product-title">${p.title}</h3>
                    
                    ${alertHtml}

                    <ul class="product-actions">
                        <li class="${p.hasAlert ? 'text-highlight' : 'text-light'}">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                            ${p.hasAlert ? 'Price alert set' : 'Set price alert'}
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                            View price history
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/></svg>
                            Compare products (2)
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66 0 1.61 1.34 2.92 3 2.92s3-1.31 3-2.92c0-1.61-1.34-2.92-3-2.92z" fill="currentColor"/></svg>
                            Share with a friend
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                            Remove product
                        </li>
                    </ul>

                    <a href="${p.link}" target="_blank" class="shop-link">
                        <img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" class="shop-icon" onerror="this.src='https://via.placeholder.com/20?text=S'">
                        ${p.shop_name}
                    </a>

                    <div class="product-price-container">
                        <div class="product-price">${p.price}</div>
                        <a href="${p.link}" target="_blank" class="buy-btn">
                            Buy now
                        </a>
                    </div>
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
