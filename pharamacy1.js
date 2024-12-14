let cart = [];
let totalPrice = 0;
let medicines = {};

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the medicines data from JSON file
    fetch('medicines.json')
        .then(response => response.json())
        .then(data => {
            medicines = data;
        })
        .catch(error => console.error('Error loading medicines data:', error));

    // Load favourites if available
    const savedFavourites = JSON.parse(localStorage.getItem('favourites'));
    if (savedFavourites) {
        cart = savedFavourites;
        updateCartDisplay();
    }
});

function showMedicines(category) {
    const medicineList = document.getElementById("medicine-items");
    const title = document.getElementById("medicine-title");
    
    // Clear any existing content
    medicineList.innerHTML = "";
    
    // Get the medicines for the selected category
    const medicinesInCategory = medicines[category];
    
    // Ensure there are always 8 medicines displayed
    const numberOfMedicines = 8;
    const displayMedicines = medicinesInCategory.slice(0, numberOfMedicines);
    
    displayMedicines.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: LKR ${item.price}</p>
            <label for="quantity-${item.name}">Quantity:</label>
            <input type="number" id="quantity-${item.name}" min="1" value="1">
            <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
        `;
        medicineList.appendChild(div);
    });
}

function addToCart(name, price) {
    const quantityInput = document.getElementById(`quantity-${name}`);
    const quantity = parseInt(quantityInput.value, 10);
    if (quantity > 0) {
        const cartItem = { name, price, quantity };
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push(cartItem);
        }
        updateCartDisplay();
        quantityInput.value = "1";  // Clear and set the input field to 1 after adding to cart
    } else {
        alert("Please enter a valid quantity.");
    }
}

function updateCart(name, price, quantity) {
    const quantityValue = parseInt(quantity, 10);
    if (quantityValue > 0) {
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity = quantityValue;
            updateCartDisplay();
        }
    } else {
        alert("Please enter a valid quantity.");
    }
}

function updateCartDisplay() {
    const cartBody = document.getElementById("cart-body");
    const totalPriceElement = document.getElementById("total-price");
    
    cartBody.innerHTML = "";
    totalPrice = 0;
    
    cart.forEach(item => {
        const totalItemPrice = item.quantity * item.price;
        totalPrice += totalItemPrice;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.price.toFixed(2)}</td>
            <td>LKR ${totalItemPrice.toFixed(2)}</td>
            <td><button onclick="removeFromCart('${item.name}')">Remove</button></td>
        `;
        cartBody.appendChild(row);
    });
    
    totalPriceElement.textContent = `LKR ${totalPrice.toFixed(2)}`;
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        updateCartDisplay();
    }
}

// Adding to Favourites
document.getElementById("add-to-favourites").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Sorry, you have not chosen any meds.");
    } else {
        localStorage.setItem("favourites", JSON.stringify(cart));
        alert("Meds have been saved to favorites!");
    }
});
// Applying Favourites
document.getElementById("apply-favourites").addEventListener("click", function() {
    const favourites = JSON.parse(localStorage.getItem("favourites"));
    if (favourites && favourites.length > 0) {
        cart = favourites;
        updateCartDisplay();
    }
});

document.getElementById('buy-now').addEventListener('click', function() {
    const cartBody = document.getElementById('cart-body');
    if (cartBody.rows.length === 0) {
        alert('Your cart is empty! Please add some items before proceeding to buy.');
    } else {
        // Collect cart items and save to local storage
        const cartItems = [];
        for (let i = 0; i < cartBody.rows.length; i++) {
            const row = cartBody.rows[i];
            const item = {
                name: row.cells[0].innerText,
                quantity: row.cells[1].innerText,
                price: row.cells[2].innerText,
                total: row.cells[3].innerText
            };
            cartItems.push(item);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        // Navigate to the Buy Now page
        window.location.href = 'buy_now.html';
    }
});
