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
            // Безопасно извличане на домейн за иконата
            let domain = "";
            try {
                domain = new URL(p.link).hostname;
            } catch (e) {
                domain = p.link.replace('https://', '').replace('http://', '').split('/')[0];
            }

            // Логика за показване на аларма (точно като на снимката)
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
                    <div style="font-size: 0.85rem; font-weight: bold; color: #333;">Samsung GALAXY</div>
                    <div style="font-weight: bold; font-size: 1.1rem; margin-top: 5px;">${p.price}</div>
                </div>

                <div style="flex: 1; border-left: 1px dashed #ddd; padding-left: 15px;">
                    <h3 style="font-size: 0.9rem; font-weight: normal; margin-bottom: 10px; line-height: 1.2;">${p.title}</h3>
                    
                    <a href="${p.link}" target="_blank" class="buy-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #2ecc71; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-bottom: 10px;">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/></svg>
                        Купи продукта
                    </a>

                    <ul class="product-actions" style="list-style: none; padding: 0; margin: 0;">
                        <li style="color: #e83e8c; font-size: 0.85rem; margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                            Create price alert
                        </li>
                        <li style="color: #e83e8c; font-size: 0.85rem; margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap
