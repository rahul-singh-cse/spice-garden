// ========================================
// SPICE GARDEN - MENU, CART & CHECKOUT
// ========================================

const menuItems = [
  {
    id: 1,
    name: "Veg Biryani",
    price: 180,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    description: "Aromatic basmati rice with fresh vegetables and spices."
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    description: "Creamy tomato gravy with soft paneer."
  },
  {
    id: 3,
    name: "Masala Dosa",
    price: 120,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    description: "Crispy dosa served with chutney and sambar."
  },
  {
    id: 4,
    name: "Veg Burger",
    price: 100,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
    description: "Crispy veggie patty with fresh lettuce."
  },
  {
    id: 5,
    name: "French Fries",
    price: 80,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    description: "Golden, crispy and lightly salted fries."
  },
  {
    id: 6,
    name: "Lime Soda",
    price: 60,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1643660090106-68d166a4ce94?auto=format&fit=crop&w=800&q=80",
    description: "Refreshing lime drink served chilled."
  },
  {
    id: 7,
    name: "Chocolate Shake",
    price: 120,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    description: "Rich and creamy chocolate milkshake."
  },
  {
    id: 8,
    name: "Gulab Jamun",
    price: 70,
    category: "Desserts",
    image: "https://images.pexels.com/photos/9198596/pexels-photo-9198596.jpeg?auto=compress&dpr=1&h=750&w=1260",
    description: "Soft, sweet dumplings in sugar syrup."
  }
];

// Replace this example with your restaurant's real WhatsApp number.
const RESTAURANT_WHATSAPP = "919876543210";

let cart = [];
let activeCategory = "All";

const money = amount =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

// ========================================
// MENU
// ========================================

function getMenuContainer() {
  return document.querySelector(
    "#food-grid, #menu .menu-grid, #menu .food-grid, #menu .menu-items, .menu-grid, .food-grid, #menuItems, #food-container"
  );
}

function renderMenu() {
  const container = getMenuContainer();

  if (!container) {
    console.error("Menu container nahi mila. index.html check karo.");
    return;
  }

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter(item => item.category === activeCategory);

  container.innerHTML = filteredItems.map(item => `
    <article class="food-card">
      <img
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/800x500/f3eee4/294c35?text=Food+Photo';"
      >
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p><strong>${money(item.price)}</strong></p>
      <button type="button" onclick="addToCart(${item.id})">
        Add to Cart
      </button>
    </article>
  `).join("");
}

function renderFilters() {
  const container = document.querySelector(
    "#menu .filter-buttons, #menu .category-buttons, #menu .menu-filters, #filters"
  );

  if (!container) return;

  const categories = [
    "All",
    ...new Set(menuItems.map(item => item.category))
  ];

  container.innerHTML = categories.map(category => `
    <button
      type="button"
      class="filter-btn"
      aria-pressed="${activeCategory === category}"
      onclick="filterMenu('${category}')"
    >
      ${category}
    </button>
  `).join("");
}

function filterMenu(category) {
  activeCategory = category;
  renderFilters();
  renderMenu();
}

// ========================================
// CART
// ========================================

function addToCart(id) {
  const item = menuItems.find(food => food.id === id);
  if (!item) return;

  const existing = cart.find(food => food.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(food => food.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(food => food.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function getCartTotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function renderCart() {
  const container = document.querySelector(
    "#cart-items, #cartItems, .cart-items"
  );

  const totalElement = document.getElementById("cart-total");

  const countElement = document.querySelector(
    "#cart-count, #cartCount"
  );

  if (container) {
    container.innerHTML = cart.length
      ? cart.map(item => `
          <div class="cart-row">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${money(item.price * item.quantity)}</strong>
            <button type="button"
              onclick="changeQuantity(${item.id}, -1)">−</button>
            <button type="button"
              onclick="changeQuantity(${item.id}, 1)">+</button>
            <button type="button"
              onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        `).join("")
      : "<p>Your cart is empty. Add something delicious!</p>";
  }

  const total = getCartTotal();

  if (totalElement) {
    totalElement.textContent = money(total);
  }

  if (countElement) {
    countElement.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // Always update checkout from the actual cart.
  const checkoutTotal = document.getElementById("checkout-total");

  if (checkoutTotal) {
    checkoutTotal.textContent = money(total);
  }
}

// ========================================
// WHATSAPP ORDER
// ========================================

function orderOnWhatsApp() {
  if (cart.length === 0) {
    alert("Please add some food to your cart first.");
    return;
  }

  if (RESTAURANT_WHATSAPP === "919876543210") {
    alert(
      "Please replace the example WhatsApp number in script.js with your restaurant's real number."
    );
    return;
  }

  const lines = cart.map(item =>
    `${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`
  );

  const message = [
    "Hello Spice Garden!",
    "I would like to place an order:",
    "",
    ...lines,
    "",
    `Total: ${money(getCartTotal())}`
  ].join("\n");

  const url =
    `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

// ========================================
// CHECKOUT & DEMO PAYMENT
// ========================================

function setupCheckout() {
  const form = document.getElementById("checkout-form");
  const paymentDemo = document.getElementById("payment-demo");
  const payButton = document.getElementById("demo-pay-btn");
  const message = document.getElementById("checkout-message");

  if (!form || !paymentDemo || !payButton || !message) {
    console.error(
      "Checkout elements missing. Check the checkout section in index.html."
    );
    return;
  }

  // Show the latest cart total when checkout is opened.
  const checkoutTotal = document.getElementById("checkout-total");

  if (checkoutTotal) {
    checkoutTotal.textContent = money(getCartTotal());
  }

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    renderCart();

    if (cart.length === 0 || getCartTotal() <= 0) {
      message.textContent =
        "Please add food to your cart first.";
      paymentDemo.hidden = true;
      return;
    }

    paymentDemo.hidden = false;
    message.textContent =
      "Details accepted. This is a demo only; no real order has been placed.";

    paymentDemo.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  payButton.addEventListener("click", function() {
    if (cart.length === 0 || getCartTotal() <= 0) {
      message.textContent = "Your cart is empty. Please add food first.";
      paymentDemo.hidden = true;
      return;
    }

    message.textContent =
      `Demo complete! Your displayed total is ${money(getCartTotal())}. No real payment was collected and no order was placed.`;
  });
}

// ========================================
// START WEBSITE
// ========================================

document.addEventListener("DOMContentLoaded", function() {
  renderFilters();
  renderMenu();
  renderCart();
  setupCheckout();

  const orderButtons = document.querySelectorAll(
    "#order-btn, #order-whatsapp, #whatsapp-order, .whatsapp-order"
  );

  orderButtons.forEach(button => {
    button.addEventListener("click", orderOnWhatsApp);
  });
});

// Functions used by inline menu/cart buttons.
window.filterMenu = filterMenu;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.orderOnWhatsApp = orderOnWhatsApp;
