// Week 5: JavaScript catalogue, restaurant navigation and localStorage cart.
// Weeks 8-10 use the same Fetch API approach on their dedicated pages.

const CART_KEY = 'foodexCart';

function getCart() {
  const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  return saved.map((item) => typeof item === 'string'
    ? { name: item, restaurant: 'FoodEX', price: 0, image: '' }
    : item);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCart() {
  document.querySelectorAll('.cart-link').forEach((link) => {
    link.textContent = `Cart (${getCart().length})`;
  });
}

function showOrderConfirmation(item) {
  const oldModal = document.querySelector('.modal-backdrop');
  if (oldModal) oldModal.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="order-modal">
      <div class="confirm-icon">✓</div>
      <h2>Order Confirmed</h2>
      <p><strong>${item.name}</strong> from ${item.restaurant} has been added to your FoodEX order.</p>
      <div class="button-row" style="justify-content:center">
        <a class="button secondary" href="cart.html">View Cart</a>
        <button class="button primary" type="button" id="close-order-modal">Continue</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.getElementById('close-order-modal').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
}

function addToCart(event) {
  event.preventDefault();

  const button = event.currentTarget;
  const item = {
    name: button.dataset.name || 'Food Item',
    restaurant: button.dataset.restaurant || 'FoodEX',
    price: Number(button.dataset.price || 0),
    image: button.dataset.image || ''
  };

  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCart();

  // Week 5: Confirm the order action and keep the selected item in the cart.
  showOrderConfirmation(item);
}

document.querySelectorAll('.order-btn').forEach((button) => {
  button.addEventListener('click', addToCart);
});

function money(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

// Week 5: Display the saved cart with prices and a simple order summary.
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const empty = document.getElementById('empty-cart');
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    container.innerHTML = cart.map((item, index) => `
      <article class="cart-item">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div></div>'}
        <div>
          <h3>${item.name}</h3>
          <p>${item.restaurant}</p>
          <button class="remove-item" data-index="${index}" type="button">Remove</button>
        </div>
        <strong class="cart-price">${money(item.price)}</strong>
      </article>
    `).join('');
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const count = document.getElementById('cart-count');
  const subtotalElement = document.getElementById('cart-subtotal');
  const totalElement = document.getElementById('cart-total-price');

  if (count) count.textContent = cart.length;
  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (totalElement) totalElement.textContent = money(subtotal);

  container.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const updated = getCart();
      updated.splice(Number(button.dataset.index), 1);
      saveCart(updated);
      renderCart();
      updateCart();
    });
  });
}

const placeOrder = document.getElementById('place-order');
if (placeOrder) {
  placeOrder.addEventListener('click', () => {
    const cart = getCart();

    if (!cart.length) {
      alert('Your cart is empty. Add a food item first.');
      return;
    }

    showOrderConfirmation({
      name: `${cart.length} item(s)`,
      restaurant: 'your FoodEX cart'
    });
  });
}

renderCart();
updateCart();

// Week 5: Load restaurant chains from JSON and build the home page cards.
async function loadRestaurantPreviews() {
  const restaurantPreviews = document.getElementById('restaurant-previews');
  if (!restaurantPreviews) return;

  try {
    const response = await fetch('foodex-menu.json');
    if (!response.ok) throw new Error('Restaurant request failed');

    const restaurants = await response.json();
    const menuIndex = [];

    for (const restaurant of restaurants) {
      try {
        const menuResponse = await fetch(restaurant.menuFile);
        if (!menuResponse.ok) continue;

        const lines = (await menuResponse.text()).split('\n');
        restaurant.menuItems = lines.map((line) => line.split('|')[0].trim()).filter(Boolean);
        restaurant.searchText = [
          restaurant.name,
          restaurant.cuisine,
          ...restaurant.menuItems
        ].join(' ').toLowerCase();

        menuIndex.push(restaurant);
      } catch {
        restaurant.menuItems = [];
        restaurant.searchText = `${restaurant.name} ${restaurant.cuisine}`.toLowerCase();
        menuIndex.push(restaurant);
      }
    }

    function renderRestaurants(list, query = '') {
      const heading = document.getElementById('restaurant-heading');
      const resultCount = document.getElementById('result-count');

      if (heading) heading.textContent = query ? `Search results for "${query}"` : 'Top restaurant chains';
      if (resultCount) resultCount.textContent = `${list.length} restaurant${list.length === 1 ? '' : 's'}`;

      if (!list.length) {
        restaurantPreviews.innerHTML = '<div class="empty-state">No restaurants or food items matched your search.</div>';
        return;
      }

      restaurantPreviews.innerHTML = list.map((restaurant) => `
        <article class="restaurant-card">
          <img class="restaurant-image" src="${restaurant.image}" alt="Food from ${restaurant.name}">
          <div class="restaurant-card-body">
            <p class="eyebrow">RESTAURANT</p>
            <h3>${restaurant.name}</h3>
            <div class="restaurant-meta">
              <span>⭐ ${restaurant.rating}</span>
              <strong>${restaurant.cuisine}</strong>
            </div>
            <a class="button primary" href="restaurant-menu.html?name=${encodeURIComponent(restaurant.name)}&cuisine=${encodeURIComponent(restaurant.cuisine)}&rating=${encodeURIComponent(restaurant.rating)}&menu=${encodeURIComponent(restaurant.menuFile)}&image=${encodeURIComponent(restaurant.image)}">Explore Menu</a>
          </div>
        </article>
      `).join('');
    }

    renderRestaurants(menuIndex);

    const searchForm = document.getElementById('food-search-form');
    const searchInput = document.getElementById('food-search');

    function runSearch() {
      const query = searchInput.value.trim().toLowerCase();
      const matches = !query
        ? menuIndex
        : menuIndex.filter((restaurant) => restaurant.searchText.includes(query));

      renderRestaurants(matches, searchInput.value.trim());
      document.getElementById('restaurants').scrollIntoView({ behavior: 'smooth' });
    }

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      runSearch();
    });

    document.querySelectorAll('.category-chip').forEach((button) => {
      button.addEventListener('click', () => {
        searchInput.value = button.dataset.search;
        runSearch();
      });
    });
  } catch (error) {
    restaurantPreviews.innerHTML = '<p class="menu-status">Restaurant partners are unavailable right now.</p>';
  }
}

loadRestaurantPreviews();

// Week 5: Load the selected restaurant's complete menu.
async function loadRestaurantPage() {
  const menuItems = document.getElementById('restaurant-menu-items');
  if (!menuItems) return;

  const params = new URLSearchParams(window.location.search);
  const restaurantName = params.get('name') || 'Restaurant';
  const menuFile = params.get('menu');

  document.getElementById('restaurant-name').textContent = restaurantName;
  document.getElementById('restaurant-details').textContent =
    `${params.get('cuisine') || 'FoodEX partner'} • ⭐ ${params.get('rating') || 'New'}`;

  const restaurantImage = document.getElementById('restaurant-image');
  if (restaurantImage && params.get('image')) {
    restaurantImage.src = params.get('image');
    restaurantImage.alt = `Food from ${restaurantName}`;
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

    menuItems.innerHTML = items.map((item) => {
      const numericPrice = Number((item.price || '').replace(/[^0-9.]/g, '')) || 0;

      return `
        <article class="menu-card">
          <img class="menu-item-image" src="${item.image}" alt="${item.name}">
          <div class="menu-card-body">
            <p class="eyebrow">${restaurantName}</p>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <strong>${money(numericPrice)}</strong>
            <button class="order-btn"
              type="button"
              data-name="${item.name}"
              data-restaurant="${restaurantName}"
              data-price="${numericPrice}"
              data-image="${item.image}">
              Order Now
            </button>
          </div>
        </article>
      `;
    }).join('');

    menuItems.querySelectorAll('.order-btn').forEach((button) => {
      button.addEventListener('click', addToCart);
    });
  } catch (error) {
    menuItems.innerHTML = '<p class="menu-status">Unable to load this menu right now.</p>';
  }
}

loadRestaurantPage();