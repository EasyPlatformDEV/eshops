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

            // Price Alert Button Logic
            // Price Alert Button Logic
            let priceAlertBtn = '';
            if (p.hasAlert) {
                // Active Alert: Yellow icon, Price, Edit text
                // Active Alert: Filled Bell, Border color icon
                priceAlertBtn = `
                <button class="action-btn-common alert-active-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="color: #fbe9ac;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                    <span style="margin-left:5px; margin-right:5px; font-weight:normal;">${p.alert_price}</span>
                    <span style="color: #b60378; font-weight: normal; font-size: 0.8rem; text-decoration: underline;">Edit</span>
                </button>`;
            } else {
                // Set Alert: Outline Bell, Border color icon, Text pink
                priceAlertBtn = `
                <button class="action-btn-common alert-set-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="color: #fbe9ac;"><path d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2zm11-2v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4c0-1.1.9-2 2-2s2 .9 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2zm-4-8c0-2.76-2.24-5-5-5s-5 2.24-5 5v7h10v-7z" fill="currentColor"/></svg>
                    <span style="color: #b60378;">Set price alert</span>
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

                    ${priceAlertBtn}

                    <a href="${p.link}" target="_blank" class="action-btn-common buy-now-btn">
                        Buy now
                    </a>
                </div>

                <!-- Right Column -->
                <div class="product-right-col">
                    <h3 class="product-title">${p.title}</h3>
                    
                    <div class="separator-line"></div>
                    <div class="actions-label">Actions:</div>

                    <ul class="product-actions">
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                            View price history
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L1 7v2h2.5c.35 3.63 2.5 6.64 6 7.42V20h-1.5v2h8v-2h-1.5v-3.58c3.5-.78 5.65-3.79 6-7.42H22V7L12 2zm-5.5 8c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3zm11 0c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z" fill="currentColor"/></svg>
                            Compare prices (4)
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



                    <a href="${p.link}" target="_blank" class="action-btn-common shop-link-btn">
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
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
