// FoodEX static admin extension.
// Added items are stored in localStorage and merged into restaurant menu text responses.
(function () {
  const KEY = "foodexAdminItems";
  const originalFetch = window.fetch.bind(window);

  function getItems() {
    try {
      const items = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  function toLine(item) {
    return [
      item.name,
      item.description,
      item.price,
      item.image
    ].join("|");
  }

  window.fetch = async function (input, init) {
    const response = await originalFetch(input, init);
    const url = typeof input === "string" ? input : input.url;
    if (!url || !url.includes("foodex-menu.json") && !url.includes("-menu.txt")) {
      return response;
    }

    if (!url.includes("-menu.txt")) {
      return response;
    }

    const matched = getItems().filter(function (item) {
      return item.menuFile && url.includes(item.menuFile);
    });
    if (!matched.length) return response;

    const text = await response.text();
    const extra = matched.map(toLine).join("\n");
    return new Response(text + "\n" + extra, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  };

  function setupAdmin() {
    const form = document.getElementById("admin-food-form");
    const list = document.getElementById("admin-food-list");
    if (!form || !list) return;

    const select = document.getElementById("admin-restaurant");
    const restaurantName = document.getElementById("admin-restaurant-name");

    function syncRestaurant() {
      restaurantName.value = select.options[select.selectedIndex].dataset.name;
    }

    function render() {
      const items = getItems();
      if (!items.length) {
        list.innerHTML = '<p class="muted">No admin-added food yet. Add an item above.</p>';
        return;
      }
      list.innerHTML = items.map(function (item, index) {
        return '<article class="admin-item"><div><strong>' +
          item.name + '</strong><span>' + item.restaurant + ' · ₹' +
          item.price + '</span><small>' + item.category +
          '</small></div><button class="button secondary admin-remove" type="button" data-index="' +
          index + '">Remove</button></article>';
      }).join("");

      list.querySelectorAll(".admin-remove").forEach(function (button) {
        button.addEventListener("click", function () {
          const items = getItems();
          items.splice(Number(button.dataset.index), 1);
          localStorage.setItem(KEY, JSON.stringify(items));
          render();
        });
      });
    }

    select.addEventListener("change", syncRestaurant);
    syncRestaurant();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const restaurantId = String(data.get("restaurantId") || "");
      const menuFiles = {
        R001: "spice-garden-menu.txt",
        R002: "pizza-zone-menu.txt",
        R003: "burger-house-menu.txt",
        R004: "dosa-corner-menu.txt",
        R005: "wok-bowl-menu.txt",
        R006: "sweet-cravings-menu.txt"
      };
      const item = {
        id: "A" + Date.now(),
        name: String(data.get("name") || "").trim(),
        restaurantId: restaurantId,
        restaurant: String(data.get("restaurant") || "").trim(),
        category: String(data.get("category") || "").trim(),
        price: Number(data.get("price") || 0),
        description: String(data.get("description") || "").trim(),
        image: String(data.get("image") || "").trim() ||
          "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
        menuFile: menuFiles[restaurantId]
      };

      if (!item.name || !item.restaurantId || !item.category ||
          !item.description || item.price < 1) return;

      const items = getItems();
      items.push(item);
      localStorage.setItem(KEY, JSON.stringify(items));
      form.reset();
      syncRestaurant();
      document.getElementById("admin-success").textContent =
        item.name + " was added to " + item.restaurant + ".";
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", setupAdmin);
})();