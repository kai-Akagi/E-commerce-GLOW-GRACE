import { obtenerProductos } from "../js/services/api.js";
import { addToCart, getcartUnitCount } from "../js/core/cart-state.js";




let allProducts = [];

const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('product-search');
const cartCounter = document.getElementById('cart-counter');

document.addEventListener('DOMContentLoaded', async () => {
    allProducts = await obtenerProductos();
    renderProducts(allProducts)
    updateCartcounter();
    setupEventListeners();

});

function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="loader">No se encontraron productos</p>`
        return;
    }

    productsGrid.innerHTML = products.map(product => ` 
            <div class="product-card">
                <div class="sale-badge">Oferta</div>
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <div class="price-container">
                        <span class="old-price">${(product.price*1.25).toFixed(2)}</span>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <button class="btn-primary add-to-cart-btn" data-id=${product.id}>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        
        `).join("");

        const buttons = document.querySelectorAll('.add-to-cart-btn');

        buttons.forEach(btn =>{
            btn.addEventListener('click', ()=>{
                const id = parseInt(btn.getAttribute('data-id'));
                const product = allProducts.find(p => p.id === id );
                addToCart(product)
                updateCartcounter();



            } )
        })




}

function updateCartcounter(){
    if(cartCounter){
       cartCounter.textContent = getcartUnitCount();
    }
}


function setupEventListeners(){
    searchInput.addEventListener('input', (e)=>filterProducts(e.target.value));
}

function filterProducts(filtro){
    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(filtro.toLowerCase())
    );
    renderProducts(filtered);
}
