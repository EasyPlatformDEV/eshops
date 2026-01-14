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
            <article style="display: flex; position: relative; padding: 15px; border-bottom: 1px solid #eee; background: #fff; font-family: sans-serif;">
                
                <div style="position: absolute; left: 15px; top: 15px; color: #ccc; cursor: pointer; z-index: 10;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                </div>

                <div style="flex: 0 0 130px; text-align: center; margin-right: 15px; padding-top: 40px;">
                    <img src="${p.image}" alt="${p.title}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 10px;">
                    
                    <div style="font-size: 0.75rem; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 4px;">
                        ${p.brand || 'Samsung Galaxy'}
                    </div>
                    
                    <div style="font-weight: bold; font-size: 1.25rem; color: #e83e8c;">${p.price}</div>
                    ${p.old_price ? `<div style="text-decoration:line-through; font-size:0.8rem; color:#6c757d;">${p.old_price}</div>` : ''}
                </div>

                <div style="flex: 1; border-left: 1px dashed #ddd; padding-left: 15px;">
                    <h3 style="font-size: 0.95rem; font-weight: normal; margin-bottom: 12px; line-height: 1.3; color: #333; min-height: 40px;">${p.title}</h3>
                    
                    <a href="${p.link}" target="_blank" class="buy-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/></svg>
                     Buy now
                    </a>

                    <ul style="list-style: none; padding: 0; margin: 0 0 15px 0;">
                        <li style="color: #e83e8c; font-size: 0.85rem; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/></svg>
                            Create price alert
                        </li>
                        <li style="color: #e83e8c; font-size: 0.85rem; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>
                            View price history
                        </li>
                        <li style="color: #e83e8c; font-size: 0.85rem; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66 0 1.61 1.34 2.92 3 2.92s3-1.31 3-2.92c0-1.61-1.34-2.92-3-2.92z" fill="currentColor"/></svg>
                            Share with a friend
                        </li>
                    </ul>

                    ${alertHtml}

                    <a href="${p.link}" target="_blank" style="display: flex; align-items: center; gap: 10px; background: #f1f3f5; padding: 10px; border-radius: 8px; text-decoration: none; color: #333; font-weight: bold; font-size: 0.85rem; margin-top: 10px;">
                        <img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" 
                             style="width: 20px; height: 20px; border-radius: 3px;" 
                             onerror="this.src='https://via.placeholder.com/20?text=S'">
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


