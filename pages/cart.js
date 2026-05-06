import { cart, getCartTotal, removeFromCart, clearCart, getcartUnitCount, saveCart } from "../js/core/cart-state.js"
import { sendCheckout } from "../js/services/api.js"


const cartItemContainer = document.getElementById("cart-items-container");
const summaryTotal = document.getElementById("summary-total");
const summaryCount = document.getElementById("summary-count");
const checkoutForm = document.getElementById("checkout-form-page");

document.addEventListener("DOMContentLoaded", () => {
    renderCartPage();
});


function renderCartPage() {
    if (cart.length === 0) {
        cartItemContainer.innerHTML =
            `<div style="text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Tu carrito está vacío.</p>
            <a href="index.html" class="btn-primary" style="text-decoration: none;">Ir a comprar</a>
            </div>`

            summaryCount.textContent = getcartUnitCount();
            summaryTotal.textContent = `$${getCartTotal()}`
            

        return; 
    }


    cartItemContainer.innerHTML = cart.map(item =>
        `<div class="cart-item">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price} c/u</p>
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="delete-btn" data-id="${item.id}">
                        <i data-lucide="trash-2"></i> Eliminar
                    </button>
                </div>
            </div>`
    );


    cartItemContainer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            const isPlus = btn.classList.contains("plus");
            handleQuantityChange(id, isPlus);
        })
    })

    cartItemContainer.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            handleRemove(id);
        })
    })

    summaryCount.textContent = getcartUnitCount();
    summaryTotal.textContent = `$${getCartTotal()}`

}


function handleQuantityChange(id, isPlus) {
    const item = cart.find(i => i.id === id);
    if (item) {
        if (isPlus) {
            item.quantity += 1;
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
            }

        }
        saveCart();
        renderCartPage();
    }


}

function handleRemove(id) {
    if (window.confirm("¿Estás seguro que deseas eliminar el producto del carrito?")) {
        removeFromCart(id);
        renderCartPage();
    }

}


// ─── Checkout ────────────────────────────────────────────────
async function handleCheckout(event) {
    event.preventDefault();

    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
        return;
    }

    // Deshabilitar el botón mientras se procesa
    const confirmBtn = document.getElementById("confirm-btn");
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Procesando...";

    const result = await sendCheckout(cart);

    if (result) {
        clearCart();
        window.alert(
            `✅ ¡Compra confirmada!\n\n` +
            `Pedido #${result.id}\n` +
            `Total: $${getCartTotal()}\n\n` +
            `Recibirás un correo de confirmación pronto.`
        );
        renderCartPage();
    }

    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirmar Compra";
}

// Registrar el listener del formulario
if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckout);
}


