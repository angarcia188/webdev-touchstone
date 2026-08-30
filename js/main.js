const favoriteStorageKey = "north-star-bakery-favorites";

const bakeryProducts = [
    { id: "country-sourdough", name: "Country Sourdough", category: "bread", price: "$7-$9" },
    { id: "honey-oat-loaf", name: "Honey Oat Loaf", category: "bread", price: "$8-$10" },
    { id: "rosemary-olive-batard", name: "Rosemary Olive Batard", category: "bread", price: "$9-$12" },
    { id: "croissants", name: "Croissants", category: "pastry", price: "$4-$5" },
    { id: "cinnamon-rolls", name: "Cinnamon Rolls", category: "pastry", price: "$5-$7" },
    { id: "fruit-danishes", name: "Fruit Danishes", category: "pastry", price: "$4-$6" },
    { id: "mini-celebration-cakes", name: "Mini Celebration Cakes", category: "cake", price: "$35-$45" },
    { id: "layer-cakes", name: "Layer Cakes", category: "cake", price: "$55-$90" },
    { id: "custom-dessert-cakes", name: "Custom Dessert Cakes", category: "cake", price: "$90-$150" }
];

//Render favorites at the top of the screen. If none, disable a default message
function renderFavorites(favorites) {
    const summary = document.querySelector("#favorites-summary");
    const list = document.querySelector("#favorites-list");
    const favoriteProducts = bakeryProducts.filter((product) => favorites.includes(product.id));

    if (favoriteProducts.length <= 0) {
        summary.textContent = "You have not saved any favorites yet."
    }
    else if (favoriteProducts.length == 1) {
        summary.textContent = `${favoriteProducts.length} saved item`;
    }
    else {
        summary.textContent = `${favoriteProducts.length} saved items`;
    }

    list.innerHTML = favoriteProducts.map((product) => `<li>${product.name} <span>${product.price}</span></li>`).join("");

    document.querySelectorAll("[data-favorite-id]").forEach((button) => {
        const isFavorite = favorites.includes(button.dataset.favoriteId);
        if (isFavorite) {
            button.textContent = "Remove Favorite";
        }
        else {
            button.textContent = "Save Favorite";
        }
    });
}

function loadFavorites() {
    const favorites = localStorage.getItem(favoriteStorageKey);
    return JSON.parse(favorites);
}

function saveFavorites(favorites) {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
}

//Renders all products dynamically with Favorite buttons
function renderProducts() {
    const favorites = loadFavorites();
    const categories = ["bread", "pastry", "cake"];

    categories.forEach((category) => {
        const container = document.querySelector(`#${category}-products`);
        container.innerHTML = bakeryProducts
            .filter((product) => product.category === category)
            .map(product => `<article class="product-item"><h3>${product.name}</h3><p>${product.price}</p><button type="button" data-favorite-id="${product.id}">Save favorite</button></article>`)
            .join("");
    });
    document.querySelectorAll("[data-favorite-id]").forEach((button) => {
        button.addEventListener("click", function (event) {
            const updatedFavorites = loadFavorites();
            const productId = button.dataset.favoriteId;

            if (updatedFavorites.includes(productId)) {
                const index = updatedFavorites.indexOf(productId);
                updatedFavorites.splice(index, 1);
            } else {
                updatedFavorites.push(productId);
            }
            saveFavorites(updatedFavorites);
            renderFavorites(updatedFavorites);
        });
    });
    renderFavorites(favorites);
}

//Function used in validateForm to provide immediate feedback
function showError(inputId, message) {
    const input = document.querySelector(`#${inputId}`);
    const errorSpan = document.querySelector(`#${inputId}-error`);
    input.classList.add('input-error');
    errorSpan.textContent = message;
}

//Function used in validateForm to clear valid fields
function clearError(inputId) {
    const input = document.querySelector(`#${inputId}`);
    const errorSpan = document.querySelector(`#${inputId}-error`);
    input.classList.remove('input-error');
    errorSpan.textContent = '';
}

//Validate the form inputs and return an object with validation results
function validateForm(event) {
    event.preventDefault();

    clearError('name');
    clearError('email');
    clearError('phone');
    clearError('pickup-date');
    clearError('request-type');
    clearError('item-details');

    let isValid = true;

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const pickupDate = document.querySelector('#pickup-date').value;
    const requestType = document.querySelector('#request-type').value;
    const itemDetails = document.querySelector('#item-details').value;
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    console.log(name);

    if (name.trim() === '') {
        showError('name', 'Please enter your name')
        isValid = false;
    }
    if (email.trim() === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!email.includes('@')) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    if (!regex.test(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    if (!pickupDate) {
        showError('pickup-date', 'Please enter a pickup date');
        isValid = false;
    }
    if (!requestType) {
        showError('request-type', 'Please select a request type');
        isValid = false;
    }
    if (itemDetails.trim() === '') {
        showError('item-details', 'Please provide some details');
        isValid = false;
    }

    if (isValid) {
        console.log('All fields valid -- submitting form');
    }
}

if (document.querySelector("#bread-products")) {
    renderProducts();
}
const form = document.querySelector('#preorder-form');
if (form) {
    form.addEventListener('submit', validateForm);
}