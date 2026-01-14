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
            productList.innerHTML = `<p style="padding: 20px; color: red;">Грешка при зареждане на продуктите.</p>`;
        }
    },

    renderProducts: function(products) {
        const container = document.getElementById('product-list');
        container.innerHTML = ''; 

        products.forEach(p => {
            // Проверка за аларма (от JSON-а)
            const alertHtml = p.hasAlert ? `
                <div class="alert-box">
                    <div class="alert-header">
                        <svg viewBox="0 0 24 24" width="16" height="16" class="alert-bell"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                        Price alert: ${p.alert_price || '---'}
                        <span class="alert-details">Details</span>
                    </div>
                </div>` : '';

const card = `
<article class="product-card">
    <div class="delete-icon">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
    </div>
    <div class="product-image-container">
        <img src="${p.image}" alt="${p.title}" class="product-img">
        <div class="product-price-container">
            <div class="product-price" style="font-weight:bold; font-size:1.1rem; margin-top:5px;">${p.price}</div>
        </div>
    </div>
    <div class="product-info">
        <h3 class="product-title" style="font-size:0.95rem; margin-bottom:8px;">${p.title}</h3>
        
        <a href="${p.link}" target="_blank" class="buy-btn">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/></svg>
            Купи продукта
        </a>

        ${alertHtml}

        <ul class="product-actions" style="margin-bottom:12px;">
             <li style="color:#e83e8c; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:5px; margin-bottom:4px;">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                Create price alert
             </li>
             <li style="color:#e83e8c; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:5px;">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                View price history
             </li>
        </ul>

        <a href="${p.link}" target="_blank" class="shop-link" style="display:flex; align-items:center; gap:8px; padding:6px; background:#f0f2f5; border-radius:4px; text-decoration:none; color:#333; font-size:0.85rem;">
            <img src="https://www.google.com/s2/favicons?sz=32&domain=${p.link}" width="16" height="16">
            ${p.shop_name}
        </a>
    </div>
</article>
`;
            container.insertAdjacentHTML('beforeend', card);
        });

        // Обновяване на статистиката в горната част
        const totalProducts = document.getElementById('total-products');
        if (totalProducts) totalProducts.innerText = products.length;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());

