// Week 5: Restaurant catalogue, menu navigation and localStorage cart.
// Week 8-10: Fetch API is used on the dedicated assignment pages.

const CART_KEY = "foodexCart";
const ADMIN_ITEMS_KEY = "foodexAdminItems";

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getAdminItems() {
  try {
    const items = JSON.parse(localStorage.getItem(ADMIN_ITEMS_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}
function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}
function isRootPage() {
  return (
    window.location.pathname.endsWith("/home.html") ||
    window.location.pathname.endsWith("/Project/")
  );
}
function pageLink(file) {
  return isRootPage() ? "pages/" + file : file;
}
function homeLink(anchor = "") {
  return isRootPage() ? "home.html" + anchor : "../home.html" + anchor;
}

function normalizeNavigation() {
  const nav = document.querySelector(".main-nav,header nav");
  if (!nav) return;
  const current = window.location.pathname.split("/").pop() || "home.html";
  const isHome = current === "home.html" || current === "";
  const isRestaurant = current === "restaurant-menu.html";
  const isCart = current === "cart.html";
  const isData = current === "foodex-data.html";
  const isFeedback = current === "foodex-feedback.html";
  const isNotes = current === "foodex-notes.html";
  const isAdmin = current === "admin.html";
  const isLogin = current === "login.html";
  const isRegister = current === "register.html";
  nav.className = "main-nav";
  nav.innerHTML = `<a class="${isHome ? "active" : ""}" href="${homeLink()}">Home</a>
 <a class="${isRestaurant ? "active" : ""}" href="${homeLink("#restaurants")}">Restaurants</a>
 <a class="${isData || isNotes ? "active" : ""}" href="${pageLink("foodex-data.html")}">FoodEX Data</a>
 <a class="${isAdmin ? "active" : ""}" href="${pageLink("admin.html")}">Admin</a>
 <a class="${isFeedback ? "active" : ""}" href="${pageLink("foodex-feedback.html")}">Feedback</a>
 <a class="${isCart ? "active" : ""} cart-link" href="${pageLink("cart.html")}">Cart (0)</a>
 ${isLogin ? "" : '<a href="' + pageLink("login.html") + '">Login</a>'}
 ${isRegister ? "" : '<a class="nav-cta" href="' + pageLink("register.html") + '">Register</a>'}`;
}
function updateCart() {
  const count = getCart().length;
  document.querySelectorAll(".cart-link").forEach((link) => {
    link.textContent = `Cart (${count})`;
  });
}
function showOrderConfirmation(item, isCartOrder = false) {
  document.querySelector(".modal-backdrop")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const message = isCartOrder
    ? `Your order containing ${item.name} has been confirmed successfully.`
    : `<strong>${item.name}</strong> from ${item.restaurant} has been added to your cart.`;
  const title = isCartOrder ? "Order confirmed" : "Added to cart";
  const buttons = isCartOrder
    ? `<a class="button primary" href="${homeLink()}">Continue Shopping</a>`
    : `<a class="button secondary" href="${pageLink("cart.html")}">View Cart</a><button class="button primary" type="button" id="close-order-modal">Continue Browsing</button>`;
  backdrop.innerHTML = `<div class="order-modal" role="dialog" aria-modal="true"><div class="confirm-icon">✓</div><p class="eyebrow">FOODEX ORDER</p><h2>${title}</h2><p>${message}</p><div class="button-row" style="justify-content:center">${buttons}</div></div>`;
  document.body.appendChild(backdrop);
  const closeButton = document.getElementById("close-order-modal");
  if (closeButton) {
    closeButton.addEventListener("click", () => backdrop.remove());
  }
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
}
function addToCart(event) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;
  if (!button.classList.contains("order-btn")) return;
  const item = {
    name: button.dataset.name || "Food Item",
    restaurant: button.dataset.restaurant || "FoodEX",
    price: Number(button.dataset.price || 0),
    image: button.dataset.image || "",
  };
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  updateCart();
  showOrderConfirmation(item);
}
function bindOrderButtons() {
  document.querySelectorAll(".order-btn").forEach((button) => {
    button.removeEventListener("click", addToCart);
    button.addEventListener("click", addToCart);
  });
}
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const empty = document.getElementById("empty-cart");
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = "";
    if (empty) empty.style.display = "grid";
  } else {
    if (empty) empty.style.display = "none";
    container.innerHTML = cart
      .map(
        (item, index) =>
          `<article class="cart-item">${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}<div><h3>${item.name}</h3><p>${item.restaurant}</p><button class="remove-item" data-index="${index}" type="button">Remove</button></div><strong class="cart-price">${money(item.price)}</strong></article>`,
      )
      .join("");
  }
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const count = document.getElementById("cart-count");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total-price");
  if (count) count.textContent = cart.length;
  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (totalElement) totalElement.textContent = money(subtotal);
  container.querySelectorAll(".remove-item").forEach((button) =>
    button.addEventListener("click", () => {
      const updated = getCart();
      updated.splice(Number(button.dataset.index), 1);
      saveCart(updated);
      renderCart();
      updateCart();
    }),
  );
}
function setupPlaceOrder() {
  const button = document.getElementById("place-order");
  if (!button) return;
  button.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    const itemCount = cart.length;
    saveCart([]);
    renderCart();
    updateCart();
    showOrderConfirmation({
      name: `${itemCount} item(s)`,
      restaurant: "your FoodEX cart",
    }, true);
  });

  const emptyButton = document.getElementById("empty-cart-button");
  if (emptyButton) {
    emptyButton.addEventListener("click", () => {
      if (!getCart().length) return;
      saveCart([]);
      renderCart();
      updateCart();
    });
  }
}
function dataPath(file) {
  return isRootPage() ? "data/" + file : "../data/" + file;
}

async function getRestaurants() {
  const response = await fetch(dataPath("foodex-menu.json"));
  if (!response.ok) throw new Error("Restaurant data request failed");
  const restaurants = await response.json();
  for (const restaurant of restaurants) {
    try {
      const menuResponse = await fetch(dataPath(restaurant.menuFile));
      if (!menuResponse.ok) continue;
      const lines = (await menuResponse.text())
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      restaurant.menuItems = lines.map((line) => line.split("|")[0].trim());
    } catch {
      restaurant.menuItems = [];
    }
    restaurant.adminItems = getAdminItems().filter((item) => item.restaurantId === restaurant.id);
    restaurant.searchText = [
      restaurant.name,
      restaurant.cuisine,
      ...restaurant.menuItems,
      ...restaurant.adminItems.map((item) => item.name),
    ]
      .join(" ")
      .toLowerCase();
  }
  return restaurants;
}
async function loadRestaurantPreviews() {
  const container = document.getElementById("restaurant-previews");
  if (!container) return;
  try {
    const restaurants = await getRestaurants();
    const heading = document.getElementById("restaurant-heading");
    const count = document.getElementById("result-count");
    const searchInput = document.getElementById("food-search");
    const searchForm = document.getElementById("food-search-form");
    function render(list, query = "") {
      heading.textContent = query
        ? `Search results for "${query}"`
        : "Popular restaurants";
      count.textContent = `${list.length} restaurant${list.length === 1 ? "" : "s"}`;
      if (!list.length) {
        container.innerHTML =
          '<div class="empty-state">No restaurant or food item matched your search.</div>';
        return;
      }
      container.innerHTML = list
        .map(
          (restaurant) =>
            `<article class="restaurant-card"><img class="restaurant-image" src="${restaurant.image}" alt="Food from ${restaurant.name}"><div class="restaurant-card-body"><p class="eyebrow">RESTAURANT</p><h3>${restaurant.name}</h3><div class="restaurant-meta"><span>★ ${restaurant.rating}</span><strong>${restaurant.cuisine}</strong></div><a class="button primary" href="pages/restaurant-menu.html?id=${encodeURIComponent(restaurant.id)}">Explore Menu</a></div></article>`,
        )
        .join("");
    }
    function runSearch() {
      const query = searchInput.value.trim().toLowerCase();
      const matches = query
        ? restaurants.filter((restaurant) =>
            restaurant.searchText.includes(query),
          )
        : restaurants;
      render(matches, searchInput.value.trim());
      document
        .getElementById("restaurants")
        .scrollIntoView({ behavior: "smooth" });
    }
    render(restaurants);
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch();
    });
    document.querySelectorAll(".quick-searches button").forEach((button) =>
      button.addEventListener("click", () => {
        searchInput.value = button.dataset.search;
        runSearch();
      }),
    );
  } catch {
    container.innerHTML =
      '<p class="error-message">Restaurant data could not be loaded.</p>';
  }
}
async function loadRestaurantPage() {
  const container = document.getElementById("restaurant-menu-items");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id");
  try {
    const restaurants = await getRestaurants();
    const restaurant = restaurants.find((item) => item.id === id);
    if (!restaurant) {
      container.innerHTML =
        '<p class="error-message">Restaurant not found.</p>';
      return;
    }
    document.getElementById("restaurant-name").textContent = restaurant.name;
    document.getElementById("restaurant-details").textContent =
      `${restaurant.cuisine} · ★ ${restaurant.rating}`;
    const image = document.getElementById("restaurant-image");
    image.src = restaurant.image;
    image.alt = `Food from ${restaurant.name}`;
    const menuResponse = await fetch(dataPath(restaurant.menuFile));
    if (!menuResponse.ok) throw new Error("Menu request failed");
    const items = (await menuResponse.text())
      .split("\n")
      .map((line) => {
        const [name, description, price, itemImage] = line
          .split("|")
          .map((part) => part.trim());
        return {
          name,
          description,
          price: Number(price) || 0,
          image: itemImage,
        };
      })
      .filter((item) => item.name);
    const customItems = restaurant.adminItems || [];
    items.push(...customItems);
    const count = document.getElementById("menu-count");
    if (count) count.textContent = `${items.length} items`;
    container.innerHTML = items
      .map(
        (item) =>
          `<article class="menu-card"><img class="menu-item-image" src="${item.image}" alt="${item.name}"><div class="menu-card-body"><p class="eyebrow">${restaurant.name}</p><h3>${item.name}</h3><p>${item.description}</p><strong>${money(item.price)}</strong><button class="order-btn" type="button" data-name="${item.name}" data-restaurant="${restaurant.name}" data-price="${item.price}" data-image="${item.image}">Order Now</button></div></article>`,
      )
      .join("");
    bindOrderButtons();
  } catch {
    container.innerHTML =
      '<p class="error-message">Unable to load this restaurant menu.</p>';
  }
}
normalizeNavigation();
renderCart();
setupPlaceOrder();
updateCart();
loadRestaurantPreviews();
loadRestaurantPage();
