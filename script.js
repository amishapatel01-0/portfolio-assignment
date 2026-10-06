let cartCount = 0;

function addToCart() {
    cartCount++;

    document.getElementById("cart-count").textContent = cartCount;
    document.getElementById("cart-items").textContent = cartCount;

    alert("Product added to cart!");
}

function showProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}
