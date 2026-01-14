// SPA Logic - Fetch and Render
const app = {
    init: function() {
        this.fetchProducts();
        this.registerServiceWorker();
    },

    fetchProducts: async function() {
        try {
            // За тестване в GitHub Pages: ако api.php го няма, ползвай локален масив
            const response = await fetch('api.php');
            if (!response.ok) throw new Error("PHP not available");
            const data = await response.json();
            this.renderProducts(data);
        } catch (error) {
            console.warn("Работите в статичен режим (GitHub Pages). Ползвам демо данни.");
            this.renderProducts(this.getDemoData());
        }
    },

    renderProducts: function(products) {
        const container = document.getElementById('product-list');
        container.innerHTML = products.map(p => this.createProductCard(p)).join('');
    },

    createProductCard: function(p) {
        // Тук се вмъква HTML шаблона от предишната стъпка (използвай обратни кавички ` `)
        // За краткост ще поставя само логиката за алармата:
        const alertHtml = p.hasAlert ? `
            <div class="alert-box">
                <div class="alert-header">Price alert: ${p.alertData.targetPrice} ${p.alertData.targetCurrency}</div>
                <div class="alert-body">Target: ${p.alertData.targetPrice} (Left: ${p.alertData.daysLeft} days)</div>
            </div>` : '';

        return `
            <article class="product-card">
                <div class="product-info">
                    <h3>${p.title}</h3>
                    <div class="product-price">${p.price} ${p.currency}</div>
                    ${alertHtml}
                    <a href="#" class="shop-link">${p.shop.name}</a>
                </div>
            </article>`;
    },

    getDemoData: function() {
        return [
            { id: 1, title: "Demo Product (Offline)", price: 0, currency: "$", shop: {name: "Demo", icon: ""}, hasAlert: false }
        ];
    },

    registerServiceWorker: function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log("Service Worker Registered"));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());