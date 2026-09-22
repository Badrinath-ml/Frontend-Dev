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

async function loadRestaurantPreviews() {
  const restaurantPreviews = document.getElementById('restaurant-previews');
  if (!restaurantPreviews) return;

  try {
    const response = await fetch('foodex-menu.json');
    if (!response.ok) throw new Error('Restaurant request failed');
    const restaurants = await response.json();

    restaurantPreviews.innerHTML = restaurants.map((restaurant) => `
      <article class="restaurant-card">
        <img class="restaurant-image" src="${restaurant.image}" alt="Food from ${restaurant.name}">
        <h4>${restaurant.name}</h4>
        <p>⭐ ${restaurant.rating}</p>
        <p>${restaurant.cuisine}</p>
        <button class="order-btn restaurant-menu-button" type="button">Explore</button>
      </article>
    `).join('');

    restaurantPreviews.querySelectorAll('.restaurant-menu-button').forEach((button, index) => {
      button.addEventListener('click', () => {
        const restaurant = restaurants[index];
        const params = new URLSearchParams({
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
          menu: restaurant.menuFile,
          image: restaurant.image
        });
        window.open(`restaurant-menu.html?${params}`, '_blank', 'noopener');
      });
    });
  } catch (error) {
    restaurantPreviews.innerHTML = '<p class="menu-status">Restaurant partners are unavailable right now.</p>';
  }
}

loadRestaurantPreviews();

async function loadRestaurantPage() {
  const menuItems = document.getElementById('restaurant-menu-items');
  if (!menuItems) return;

  const params = new URLSearchParams(window.location.search);
  const restaurantName = params.get('name') || 'Restaurant';
  const menuFile = params.get('menu');
  const title = document.getElementById('restaurant-name');
  const details = document.getElementById('restaurant-details');
  const image = document.getElementById('restaurant-image');
  title.textContent = restaurantName;
  details.textContent = `${params.get('cuisine') || 'FoodEx partner'} • ⭐ ${params.get('rating') || 'New'}`;
  if (image && params.get('image')) {
    image.src = params.get('image');
    image.alt = `Food from ${restaurantName}`;
  }

  if (!menuFile || !/^[\w-]+\.txt$/.test(menuFile)) {
    menuItems.innerHTML = '<p class="menu-status">This restaurant menu is unavailable.</p>';
    return;
  }

  try {
    const response = await fetch(menuFile);
    if (!response.ok) throw new Error('Menu request failed');
    const items = (await response.text()).split('\n').map((line) => {
      const [name, description, price, image] = line.split('|').map((part) => part.trim());
      return { name, description, price, image };
    }).filter((item) => item.name);
    menuItems.innerHTML = items.map((item) => `
      <article class="menu-card">
        ${item.image ? `<img class="menu-item-image" src="${item.image}" alt="${item.name}">` : ''}
        <h4>${item.name}</h4>
        <p>${item.description || 'A freshly prepared FoodEx favourite.'}</p>
        <strong>${item.price || ''}</strong>
        <button class="order-btn" data-name="${item.name}">Order Now</button>
      </article>
    `).join('');
    menuItems.querySelectorAll('.order-btn').forEach((button) => {
      button.addEventListener('click', addToCart);
    });
  } catch (error) {
    menuItems.innerHTML = '<p class="menu-status">Unable to load this menu right now.</p>';
  }
}

loadRestaurantPage();

