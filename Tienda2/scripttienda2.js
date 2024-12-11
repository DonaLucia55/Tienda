let cart = [];

function addToCart(product, price, image) {
    const existingProduct = cart.find(item => item.product === product);
    if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice += price;
    } else {
        cart.push({ product, price, image, quantity: 1, totalPrice: price });
    }
    showNotification(product + " ha sido agregado al carrito.");
    vibrateDevice();
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function vibrateDevice() {
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

function openCart() {
    const cartModal = document.getElementById("cartModal");
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    let totalAmount = 0;
    cart.forEach((item, index) => {
        totalAmount += item.totalPrice;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.product}">
            <span>${item.product}</span>
            <span>Cantidad: 
                <button onclick="decreaseQuantity(${index})">-</button>
                ${item.quantity}
                <button onclick="increaseQuantity(${index})">+</button>
            </span>
            <span>Total: $${item.totalPrice.toFixed(2)}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);
    });
    const totalAmountElement = document.createElement("div");
    totalAmountElement.className = "total-amount";
    totalAmountElement.innerHTML = `<strong>Importe Total: $${totalAmount.toFixed(2)}</strong>`;
    cartItems.appendChild(totalAmountElement);

    const orderButton = document.createElement("button");
    orderButton.className = "order-button";
    orderButton.textContent = "Ordenar por WhatsApp";
    orderButton.onclick = () => orderByWhatsApp(totalAmount);
    cartItems.appendChild(orderButton);

    cartModal.classList.add("show");
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    cart[index].totalPrice += cart[index].price;
    openCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        cart[index].totalPrice -= cart[index].price;
    } else {
        removeFromCart(index);
    }
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    openCart();
}

function closeCart() {
    const cartModal = document.getElementById("cartModal");
    cartModal.classList.remove("show");
}

function orderByWhatsApp(totalAmount) {
    let message = "Hola, me gustaría ordenar los siguientes productos:\n\n";
    cart.forEach(item => {
        message += `${item.product} - Cantidad: ${item.quantity} - Total: $${item.totalPrice.toFixed(2)}\n`;
    });
    message += `\nImporte Total: $${totalAmount.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
}

window.onclick = function(event) {
    const cartModal = document.getElementById("cartModal");
    if (event.target == cartModal) {
        cartModal.classList.remove("show");
    }
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.getElementById(tabId);
    activeTab.classList.add('active');
    const products = activeTab.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        product.classList.remove('animate__fadeIn');
        setTimeout(() => {
            product.classList.add('animate__animated', 'animate__fadeIn');
        }, index * 200);
    });
}

// Initialize the first tab to show products with fade-in effect
document.addEventListener("DOMContentLoaded", () => {
    showTab('inicio');
});

// Show fixed navigation bar on scroll
window.addEventListener('scroll', () => {
    const fixedNav = document.getElementById('fixedNav');
    if (window.scrollY > 100) {
        fixedNav.style.display = 'flex';
    } else {
        fixedNav.style.display = 'none';
    }
});
