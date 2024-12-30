let products = [
    { id: 1, name: "Product 1", price: 100, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 200, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", price: 50, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Product 4", price: 150, image: "https://via.placeholder.com/150" },
    { id: 5, name: "Product 5", price: 300, image: "https://via.placeholder.com/150" }
];

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// Function to render products on the storefront page
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        // Check if the product is in the cart
        const productInCart = cart.find(p => p.id === product.id);

        // Create the product HTML
        let productHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        if(productInCart) {
            productHTML += `
                    <button onclick="removeItem(${product.id})" ${productInCart.quantity > 0 ? '' : 'style="display:none;"'}>Remove Item</button>
                    <p>Quantity: ${productInCart.quantity}</p>
                `;
        }

        productElement.innerHTML = productHTML;
        productList.appendChild(productElement);
    });
}

// Function to handle sorting by price
function sortProducts() {
    const sortOrder = document.getElementById("sortPrice").value;
    if (sortOrder === "low-high") {
        products.sort((a, b) => a.price - b.price);
    } else {
        products.sort((a, b) => b.price - a.price);
    }
    renderProducts();
}

// Function to add products to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(p => p.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderProducts(); // Re-render products to update buttons and quantities
}

// Function to remove a product from the cart
function removeItem(productId) {
    const productIndex = cart.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const product = cart[productIndex];
        if (product.quantity > 1) {
            product.quantity--;
        } else {
            cart.splice(productIndex, 1); // Remove item completely if quantity is 1
        }
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderProducts(); // Re-render products to update buttons and quantities
}

// Function to render cart items on the cart page
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");
    const addItemsBtn = document.getElementById("add-items-btn");
    const totalPriceElem = document.getElementById("total-price");

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Nothing added to the cart yet.</p>";
        checkoutBtn.style.display = "none";
        addItemsBtn.style.display = "block";
        totalPriceElem.style.display = "none";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `).join("");

        //Calculate total price
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Display the total price
        totalPriceElem.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        totalPriceElem.style.display = "block"; // Show total price

        checkoutBtn.style.display = "block";
        addItemsBtn.style.display = "none";
    }
}

// Function to redirect to storefront
function goToStore() {
    window.location.href = "index.html";
}

// Function to handle checkout
function checkout() {
    window.location.href = "enter_details.html";
}

// Initial render for storefront page
if (document.getElementById("product-list")) {
    renderProducts();
}

// Initial render for cart page
if (document.getElementById("cart-items")) {
    renderCart();
}

// Function to update the button text dynamically on the enter details page
document.getElementById("details-form").addEventListener("change", function () {
    const paymentOption = document.querySelector('input[name="payment"]:checked').value;
    const placeOrderBtn = document.getElementById("place-order-btn");

    if (paymentOption === "on-delivery") {
        placeOrderBtn.textContent = "Place Order";
    } else {
        placeOrderBtn.textContent = "Proceed to Pay";
    }
});

// Function to render the mini cart with cart items
function renderMiniCart() {
    const miniCartItems = document.getElementById("mini-cart-items");
    const totalPriceElem = document.getElementById("mini-cart-total-price");
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        miniCartItems.innerHTML = "<p>No items in the cart</p>";
        totalPriceElem.style.display = "none";
    } else {
        miniCartItems.innerHTML = cart.map(item => `
            <div class="mini-cart-item">
                <img src="${item.image}" alt="${item.name}" class="mini-cart-img">
                <span class="item-title">${item.name}</span>
                <span class="item-quantity">x${item.quantity}&nbsp</span>
                <span class="item-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join("");

        totalPriceElem.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        totalPriceElem.style.display = "block"; // Show total price
    }
}

// Call renderMiniCart to display items when the page loads
window.onload = function() {
    renderMiniCart(); // Render mini cart on page load
}

// Handle the form submission for payment options
// Add event listener for the details form only if it exists
const detailsForm = document.getElementById('details-form');

if (detailsForm) {
    detailsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const contact = document.getElementById('contact').value;
        const address = document.getElementById('address').value;
        const paymentOption = document.querySelector('input[name="payment"]:checked').value;

        // Store details in sessionStorage
        sessionStorage.setItem('userDetails', JSON.stringify({ fullName, contact, address, paymentOption }));

        if (paymentOption === "online") {
            // Simulate redirecting to payment gateway
            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 1000);
        } else {
            window.location.href = "confirmation.html";
        }
    });
}

// Function to generate order ID
function generateOrderId() {
    const now = new Date();
    const date = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}`;
    const time = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    return `${date}-${time}`;
}

// Clear sessionStorage and redirect on "Back to Store"
function redirectToStore() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
