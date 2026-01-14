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
            // Безопасно извличане на домейн за иконата на магазина
            let domain = "";
            try {
                domain = new URL(p.link).hostname;
            } catch (e) {
                domain = p.link.replace('https://', '').replace('http://', '').split('/')[0];
            }

            // Логика за показване на аларма
            const alertHtml = p.hasAlert ? `
                <div class="alert-box" style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                        <span><span style="color: #e83e8c;">🔔</span> Price alert: <strong>${p.alert_price}</strong></span>
                        <span style="color: #e83e8c; text-decoration: underline; cursor: pointer;">Details</span>
                    </div>
                </div>` : '';

            const card = `
            <article class="product-card" style="display: flex; position: relative; padding: 15px; border-bottom: 1px solid #eee; background: #fff;">
                <div class="delete-icon" style="position: absolute; left: 10px; top: 10px; color: #ccc; cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                </div>

                <div style="flex: 0 0 120px; text-align: center; margin-right: 15px; margin-top: 20px;">
                    <img src="${p.image}" alt="${p.title}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 1.1rem; margin-top: 5px; color: var(--pink-highlight);">${p.price}</div>
                    ${p.old_price ? `<div style="text-decoration:line-through; font-size:0.8rem; color:#6c757d;">${p.old_price}</div>` : ''}
                </div>

                <div style="flex: 1; border-left: 1px dashed #ddd; padding-left: 15px;">
                    <h3 style="font-size: 0.9rem; font-weight: normal; margin-bottom: 10px; line-height: 1.2; color: #333;">${p.title}</h3>
                    
                    <a href="${p.link}" target="_blank" class="buy-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #2ecc71; color
