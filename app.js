const app = {
    init: function() {
        this.fetchProducts();
    },

    fetchProducts: async function() {
        const productList = document.getElementById('product-list');
        
        try {
            // Опитваме се да заредим данните от локалния JSON файл
            const response = await fetch('products.json');
            if (!response.ok) throw new Error("Неуспешно зареждане на данните");
            
            const products = await response.json();
            this.renderProducts(products);
            
        } catch (error) {
            console.error("Грешка:", error);
            productList.innerHTML = `<p style="padding: 20px; color: red;">Грешка при зареждане на продуктите.</p>`;
        }
    },

    renderProducts: function(products) {
        const container = document.getElementById('product-list');
        container.innerHTML = ''; // Изчистваме контейнера

        products.forEach(product => {
            const card = `
                <article class="product-card">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.title}" class="product-img">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price-container">
                            <span class="product-price" style="color: var(--pink-highlight);">${product.price}</span>
                            <span class="old-price" style="text-decoration: line-through; color: var(--text-light); font-size: 0.85rem; margin-left: 10px;">
                                ${product.old_price}
                            </span>
                        </div>
                        <a href="${product.link}" target="_blank" class="buy-btn" style="text-decoration: none; display: inline-flex; margin-top: 10px;">
                            Преглед в магазина
                        </a>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });

        // Обновяване на брояча (ако има такъв в UI)
        const counter = document.getElementById('total-products');
        if (counter) counter.innerText = products.length;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());