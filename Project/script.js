const CART_KEY = 'foodexCart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCart() {
  const cartLink = document.getElementById('cart-link');
  if (cartLink) {
    cartLink.textContent = `cart(${getCart().length})`;
  }
}

function addToCart(event) {
  event.preventDefault();
  const itemName = event.currentTarget.dataset.name || 'Food Item';
  const cart = getCart();
  cart.push(itemName);
  saveCart(cart);
  alert('Added to cart');
  updateCart();
}

const orderButtons = document.querySelectorAll('.order-btn, #order-now a');
orderButtons.forEach((button) => {
  button.addEventListener('click', addToCart);
});

const cartList = document.getElementById('cart-items');
if (cartList) {
  const cart = getCart();
  if (!cart.length) {
    cartList.innerHTML = '<li>Your cart is empty.</li>';
  } else {
    cartList.innerHTML = cart.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('');
  }

  const total = document.getElementById('cart-total');
  if (total) {
    total.textContent = `Total items: ${cart.length}`;
  }
}

updateCart();

