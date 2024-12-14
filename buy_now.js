document.addEventListener('DOMContentLoaded', function() {
    const buyNowBody = document.getElementById('buy-now-body');
    const grandTotalElement = document.getElementById('grand-total');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let grandTotal = 0;

    cartItems.forEach(item => {
        const row = buyNowBody.insertRow();
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = item.quantity;
        row.insertCell(2).innerText = item.price;
        row.insertCell(3).innerText = item.total;
        grandTotal += parseFloat(item.total.replace('LKR ', ''));
    });

    grandTotalElement.innerText = `LKR ${grandTotal.toFixed(2)}`;

    // Handle payment method change
    document.getElementById('cash-on-delivery').addEventListener('change', function() {
        document.getElementById('card-details').style.display = 'none';
    });

    document.getElementById('card-payment').addEventListener('change', function() {
        document.getElementById('card-details').style.display = 'block';
    });

    // Handle form submission
    document.getElementById('purchase-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postalCode = document.getElementById('postal-code').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        // Validate card details if payment method is card
        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all card details.');
                return;
            }
        }

        // Show thank you message
        document.getElementById('thank-you-message').style.display = 'block';
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);  // Estimated delivery in 7 days
        document.getElementById('delivery-date').innerText = deliveryDate.toDateString();
    });
});
