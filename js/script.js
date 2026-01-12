// Delivery fee configuration
const DELIVERY_FEES = {
  METROPOLIS: 2500,
  SUB_METROPOLIS: 3500,
  OUTSKIRTS: 4500,
};

const SERVICE_FEE = 300;

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_1addu86",
  TEMPLATE_ID: "template_o0c1tt5",
  PUBLIC_KEY: "Syl6_Q_1-IlMBpDug",
};

// This will store our restaurants
let restaurants = [];

// This function loads restaurants from the JSON file
async function loadRestaurantsFromJSON() {
  try {
    console.log("Loading restaurants from JSON file...");

    // Fetch the JSON file
    const response = await fetch("restaurants.json");

    // Check if the file was found
    if (!response.ok) {
      throw new Error("restaurants.json file not found");
    }

    // Read the JSON data
    const data = await response.json();

    // Store the restaurants in our variable
    restaurants = data.restaurants;

    console.log("Successfully loaded", restaurants.length, "restaurants");

    // Now display the restaurants
    applyFilters();
  } catch (error) {
    console.error("Error loading restaurants:", error);

    // If JSON file fails, use backup data
    restaurants = [
      {
        id: 1,
        name: "KFC Calabar",
        description: "Finger lickin' good!",
        image: "images/restaurants/kfc-logo.jpg",
        fallback: "🍗",
        deliveryTime: "25-35min",
        rating: "4.5",
        featured: true,
        category: "fastfood",
        cuisine: "American",
        menu: [
          {
            id: 100,
            name: "3 Pieces Chicken Meal",
            description: "3 pieces chicken + fries + drink",
            price: 3500,
            image: "img/crispy/3piece.jpg",
          },
        ],
      },
      {
        id: 2,
        name: "Domino's Pizza",
        description: "Pizza delivery experts",
        image: "images/restaurants/dominos-logo.jpg",
        fallback: "🍕",
        deliveryTime: "30-40min",
        rating: "4.7",
        popular: true,
        category: "international",
        cuisine: "Italian",
        menu: [
          {
            id: 200,
            name: "Medium Pepperoni Pizza",
            description: "12-inch pepperoni pizza",
            price: 5500,
            image: "img/dominos/mediumpeperoni.jpg",
          },
        ],
      },
    ];

    applyFilters();
    alert("Using backup restaurant data.");
  }
}

let cart = [];
let currentRestaurant = null;
let selectedDeliveryArea = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadCartFromStorage();
  loadRestaurantsFromJSON();
  updateCartCount();
  updateCartDisplay();
  initializeEmailJS();
});

// Initialize EmailJS
function initializeEmailJS() {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
  } else {
    console.error("EmailJS library not loaded");
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("calabarQuickBiteCart", JSON.stringify(cart));
    localStorage.setItem("calabarQuickBiteDeliveryArea", selectedDeliveryArea);
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("calabarQuickBiteCart");
    const savedArea = localStorage.getItem("calabarQuickBiteDeliveryArea");

    if (savedCart) {
      cart = JSON.parse(savedCart);
    }

    if (savedArea) {
      selectedDeliveryArea = savedArea;
      updateDeliveryAreaSelection();
    }
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    cart = [];
  }
}

function updateDeliveryAreaSelection() {
  const radioButtons = document.querySelectorAll('input[name="deliveryArea"]');
  radioButtons.forEach((radio) => {
    if (radio.value === selectedDeliveryArea) {
      radio.checked = true;
    }
  });
}

function loadRestaurants() {
  const restaurantsList = document.getElementById("restaurantsList");
  restaurantsList.innerHTML = "";

  restaurants.forEach((restaurant) => {
    const restaurantCard = document.createElement("div");
    restaurantCard.className = `restaurant-card ${
      restaurant.featured ? "featured" : ""
    } ${restaurant.popular ? "popular" : ""}`;
    restaurantCard.innerHTML = `
            <div class="restaurant-thumbnail">
                <img src="${restaurant.image}" alt="${
      restaurant.name
    }" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="fallback" style="display: none;">${
                  restaurant.fallback
                }</div>
            </div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <div class="restaurant-meta">
                    <span class="delivery-time">🚴 ${
                      restaurant.deliveryTime || "25-35min"
                    }</span>
                    <span class="rating">⭐ ${restaurant.rating || "4.5"}</span>
                </div>
                <button class="menu-btn" onclick="showMenu(${
                  restaurant.id
                })">Quick Menu</button>
            </div>
        `;
    restaurantsList.appendChild(restaurantCard);
  });
}

// Filter variables
let currentFilter = "all";
let currentSearch = "";

// Initialize filters
function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("restaurantSearch");

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Set current filter
      currentFilter = this.getAttribute("data-filter");

      // Apply filters
      applyFilters();
    });
  });

  // Add input event to search box
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentSearch = this.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

// Function to check if restaurant matches search criteria (including menu items)
function restaurantMatchesSearch(restaurant, searchTerm) {
  if (!searchTerm) return true;

  // Check restaurant properties first (fast check)
  if (
    restaurant.name.toLowerCase().includes(searchTerm) ||
    restaurant.description.toLowerCase().includes(searchTerm) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm)
  ) {
    return true;
  }

  // Check menu items if restaurant has a menu
  if (restaurant.menu && Array.isArray(restaurant.menu)) {
    const menuMatch = restaurant.menu.some(
      (menuItem) =>
        menuItem.name.toLowerCase().includes(searchTerm) ||
        menuItem.description.toLowerCase().includes(searchTerm)
    );
    if (menuMatch) return true;
  }

  return false;
}

// Apply both category filter and search filter
function applyFilters() {
  let filteredRestaurants = [];
  let matchedMenuItems = [];

  // If there's a search term, we need to check for menu items
  if (currentSearch) {
    // First, check for menu item matches
    restaurants.forEach((restaurant) => {
      // Apply category filter
      const categoryMatch =
        currentFilter === "all" || restaurant.category === currentFilter;

      if (categoryMatch && restaurant.menu && Array.isArray(restaurant.menu)) {
        const matchingMenuItems = restaurant.menu.filter(
          (menuItem) =>
            menuItem.name.toLowerCase().includes(currentSearch) ||
            menuItem.description.toLowerCase().includes(currentSearch)
        );

        if (matchingMenuItems.length > 0) {
          // Store the restaurant with its matching menu items
          filteredRestaurants.push({
            ...restaurant,
            matchingMenuItems: matchingMenuItems,
            isMenuSearchResult: true,
          });
        }
      }
    });

    // If no menu items found, fall back to regular restaurant search
    if (filteredRestaurants.length === 0) {
      filteredRestaurants = restaurants.filter((restaurant) => {
        // Apply category filter
        const categoryMatch =
          currentFilter === "all" || restaurant.category === currentFilter;

        // Apply search filter
        const searchMatch = restaurantMatchesSearch(restaurant, currentSearch);

        return categoryMatch && searchMatch;
      });
    }
  } else {
    // No search term, just apply category filter
    filteredRestaurants = restaurants.filter((restaurant) => {
      return currentFilter === "all" || restaurant.category === currentFilter;
    });
  }

  // Display filtered results
  displayFilteredRestaurants(filteredRestaurants);

  // Update results count
  updateResultsCount(filteredRestaurants.length, currentSearch);
}

// Display filtered restaurants with menu items if applicable
function displayFilteredRestaurants(filteredRestaurants) {
  const restaurantsList = document.getElementById("restaurantsList");

  if (filteredRestaurants.length === 0) {
    restaurantsList.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🍕</div>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No results found</h3>
                <p style="color: #888;">Try adjusting your search or filter criteria</p>
                <button onclick="clearFilters()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: #ee5a24; color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Clear Filters
                </button>
            </div>
        `;
    return;
  }

  restaurantsList.innerHTML = "";

  filteredRestaurants.forEach((restaurant) => {
    const restaurantCard = document.createElement("div");
    restaurantCard.className = `restaurant-card ${
      restaurant.featured ? "featured" : ""
    } ${restaurant.popular ? "popular" : ""}`;

    let menuItemsHTML = "";

    // If this is a menu search result, show matching menu items
    if (restaurant.isMenuSearchResult && restaurant.matchingMenuItems) {
      menuItemsHTML = `
        <div class="menu-search-results" style="margin-top: 10px; padding: 10px; background: rgba(238, 90, 36, 0.1); border-radius: 8px;">
          <div style="font-size: 12px; color: #ee5a24; margin-bottom: 5px; font-weight: bold;">
            🍽️ Matching Menu Items:
          </div>
          ${restaurant.matchingMenuItems
            .map(
              (item) => `
            <div class="matching-menu-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin: 5px 0; background: white; border-radius: 6px; border: 1px solid #eee;">
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 13px;">${
                  item.name
                }</div>
                <div style="font-size: 11px; color: #666; margin-top: 2px;">${
                  item.description
                }</div>
              </div>
              <div style="font-weight: bold; color: #ee5a24; font-size: 14px; margin-left: 10px;">
                ₦${item.price.toLocaleString()}
              </div>
            </div>
          `
            )
            .join("")}
          <div style="text-align: center; margin-top: 8px;">

          </div>
        </div>
      `;
    }

    restaurantCard.innerHTML = `
            <div class="restaurant-thumbnail">
                <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="fallback" style="display: none;">${restaurant.fallback}</div>
            </div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <div class="restaurant-meta">
                    <span class="delivery-time">🚴 ${restaurant.deliveryTime}</span>
                    <span class="rating">⭐ ${restaurant.rating}</span>
                </div>
                <div class="cuisine-badge">${restaurant.cuisine}</div>
                ${menuItemsHTML}
                <button class="menu-btn" onclick="showMenu(${restaurant.id})">View Menu</button>
            </div>
        `;
    restaurantsList.appendChild(restaurantCard);
  });
}

// Update results count with search context
function updateResultsCount(count, searchTerm = "") {
  let resultsCountElement = document.getElementById("resultsCount");

  if (!resultsCountElement) {
    resultsCountElement = document.createElement("div");
    resultsCountElement.id = "resultsCount";
    resultsCountElement.style.cssText =
      "text-align: center; margin: 1rem 0; color: #666; font-weight: 600;";
    document
      .querySelector(".restaurants-section .container")
      .insertBefore(
        resultsCountElement,
        document.getElementById("restaurantsList")
      );
  }

  let message = `Showing ${count} of ${restaurants.length} restaurants`;

  if (searchTerm) {
    message = `Found ${count} result${
      count !== 1 ? "s" : ""
    } for "${searchTerm}"`;
  }

  resultsCountElement.textContent = message;
}

// Clear all filters
function clearFilters() {
  // Reset filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.filter-btn[data-filter="all"]')
    .classList.add("active");

  // Reset search input
  const searchInput = document.getElementById("restaurantSearch");
  if (searchInput) {
    searchInput.value = "";
  }

  // Reset filter variables
  currentFilter = "all";
  currentSearch = "";

  // Apply filters (which will show all restaurants)
  applyFilters();
}

// Update the showMenu function to highlight searched items if applicable
function showMenu(restaurantId, highlightSearchTerm = null) {
  currentRestaurant = restaurants.find((r) => r.id === restaurantId);

  // Use search term from currentSearch if no highlight term provided
  const highlightTerm = highlightSearchTerm || currentSearch;

  const menuModal = document.createElement("div");
  menuModal.className = "menu-modal";

  let menuContent = currentRestaurant.menu
    .map((item) => {
      // Highlight matching menu items if there's a search term
      const isMatchingItem =
        highlightTerm &&
        (item.name.toLowerCase().includes(highlightTerm) ||
          item.description.toLowerCase().includes(highlightTerm));

      const highlightStyle = isMatchingItem
        ? "border: 2px solid #ee5a24; background-color: #fff3e0;"
        : "";

      return `
      <div class="menu-item" style="${highlightStyle}">
        <div class="item-image">
            <img src="${
              item.image || "images/restaurants/default-food.jpg"
            }" alt="${item.name}" onerror="this.style.display='none'">
        </div>
        <div class="item-info">
            <h4>${item.name}${isMatchingItem ? " 🔍" : ""}</h4>
            <p>${item.description}</p>
            <span class="item-price">₦${item.price.toLocaleString()}</span>
        </div>
        <button class="add-to-cart" onclick="addToCart(${
          item.id
        })">Add to Cart</button>
      </div>
    `;
    })
    .join("");

  menuModal.innerHTML = `
    <div class="menu-header" style="width: 100%; justify-content: center;">
        <h3>${currentRestaurant.name} Menu</h3>
        <button onclick="closeMenu()">×</button>
    </div>
    <div class="menu-items">
        ${menuContent}
    </div>
  `;

  document.body.appendChild(menuModal);
  showOverlay();
}

// Update the loadRestaurants function to use filters
function loadRestaurants() {
  initializeFilters();
  applyFilters(); // This will display all restaurants initially
}

// Update the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  loadCartFromStorage();
  loadRestaurants(); // This now initializes filters and displays restaurants
  updateCartCount();
  updateCartDisplay();
  initializeEmailJS();
});

function showMenu(restaurantId) {
  currentRestaurant = restaurants.find((r) => r.id === restaurantId);

  const menuModal = document.createElement("div");
  menuModal.className = "menu-modal";
  menuModal.innerHTML = `
        <div class="menu-header" style="width: 100%; justify-content: center;">
            <h3>${currentRestaurant.name} Menu</h3>
            <button onclick="closeMenu()">×</button>
        </div>
        <div class="menu-items">
            ${currentRestaurant.menu
              .map(
                (item) => `
                <div class="menu-item">
                    <div class="item-image">
                        <img src="${
                          item.image || "images/restaurants/default-food.jpg"
                        }" alt="${
                  item.name
                }" onerror="this.style.display='none'">
                    </div>
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <span class="item-price">₦${item.price.toLocaleString()}</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${
                      item.id
                    })">Add to Cart</button>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  document.body.appendChild(menuModal);
  showOverlay();
}

function closeMenu() {
  const menuModal = document.querySelector(".menu-modal");
  if (menuModal) {
    menuModal.remove();
  }
  hideOverlay();
}

function addToCart(itemId) {
  const restaurant = currentRestaurant;
  const item = restaurant.menu.find((m) => m.id === itemId);

  const existingItem = cart.find((cartItem) => cartItem.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant: restaurant.name,
    });
  }

  updateCartCount();
  updateCartDisplay();
  saveCartToStorage();
  showNotification(`${item.name} added to cart!`);
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: #666;">Your cart is empty</p>';
    cartTotal.textContent = "0";
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.restaurant}</p>
                <p class="item-price">₦${item.price.toLocaleString()} × ${
      item.quantity
    } = ₦${itemTotal.toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
    cartItems.appendChild(cartItem);
  });

  // Calculate total - only add delivery fee if area is selected
  const deliveryFee = selectedDeliveryArea
    ? DELIVERY_FEES[selectedDeliveryArea]
    : 0;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  cartTotal.innerHTML = total.toLocaleString();
}

function updateQuantity(itemId, change) {
  const item = cart.find((cartItem) => cartItem.id === itemId);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartCount();
      updateCartDisplay();
      saveCartToStorage();
    }
  }
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCartCount();
  updateCartDisplay();
  saveCartToStorage();

  if (cart.length === 0) {
    toggleCart(); // Close cart if empty
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  cartSidebar.classList.toggle("active");
}

function showCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const checkoutModal = document.getElementById("checkoutModal");
  const orderSummary = document.getElementById("orderSummary");

  // Reset delivery area selection when opening checkout
  selectedDeliveryArea = null;
  updateDeliveryAreaSelection();

  // Calculate initial fees (without delivery fee until area selected)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 0;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  // Populate order summary with fee breakdown
  updateOrderSummary(subtotal, deliveryFee, total);

  document.getElementById("orderTotal").textContent = total.toLocaleString();

  // Pre-fill address if set
  const deliveryAddress = document.getElementById("deliveryAddress").value;
  if (deliveryAddress) {
    document.getElementById("customerAddress").value = deliveryAddress;
  }

  checkoutModal.style.display = "block";
  showOverlay();
  toggleCart(); // Close cart sidebar
}

// New function to update order summary dynamically
function updateOrderSummary(subtotal, deliveryFee, total) {
  const orderSummary = document.getElementById("orderSummary");

  orderSummary.innerHTML = `
        ${cart
          .map(
            (item) => `
            <div class="fee-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>₦${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `
          )
          .join("")}
        <div class="fee-item">
            <span>Subtotal</span>
            <span>₦${subtotal.toLocaleString()}</span>
        </div>
        <div class="fee-item">
            <span>Delivery Fee ${
              selectedDeliveryArea
                ? `(${getDeliveryAreaName(selectedDeliveryArea)})`
                : ""
            }</span>
            <span>₦${deliveryFee.toLocaleString()}</span>
        </div>
        <div class="fee-item">
            <span>Service Fee</span>
            <span>₦${SERVICE_FEE.toLocaleString()}</span>
        </div>
        <div class="fee-item fee-total">
            <span>Total Amount</span>
            <span>₦${total.toLocaleString()}</span>
        </div>
    `;
}

// Updated setDeliveryArea function to live update totals
function setDeliveryArea(area) {
  selectedDeliveryArea = area;

  // Recalculate fees with the selected delivery area
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEES[selectedDeliveryArea];
  const total = subtotal + deliveryFee + SERVICE_FEE;

  // Update the order summary and total display
  updateOrderSummary(subtotal, deliveryFee, total);
  document.getElementById("orderTotal").textContent = total.toLocaleString();

  // Also update cart display if cart sidebar is open
  updateCartDisplay();
  saveCartToStorage();

  showNotification(
    `Delivery area set to ${getDeliveryAreaName(
      area
    )} - ₦${deliveryFee.toLocaleString()}`
  );
}

// Updated updateDeliveryAreaSelection function
function updateDeliveryAreaSelection() {
  const radioButtons = document.querySelectorAll('input[name="deliveryArea"]');
  radioButtons.forEach((radio) => {
    radio.checked = radio.value === selectedDeliveryArea;
  });
}

// Helper function to get delivery area display name
function getDeliveryArea(area) {
  const areaNames = {
    METROPOLIS: "Metropolis Area",
    SUB_METROPOLIS: "Sub-Metropolis Area",
    OUTSKIRTS: "Outskirts Area",
  };
  return areaNames[area] || area;
}

// Updated showBankDetails function with delivery fee validation
function showBankDetails() {
  const form = document.getElementById("checkoutForm");
  const customerName = document.getElementById("customerName").value.trim();
  const customerAddress = document
    .getElementById("customerAddress")
    .value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();

  if (!customerName || !customerAddress || !customerPhone) {
    alert(
      "Please fill in all required fields: Name, Address, and Phone Number."
    );
    return;
  }

  // Validate phone number format
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(customerPhone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  // Check if delivery area is selected
  if (!selectedDeliveryArea) {
    alert("Please select a delivery area to continue.");
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEES[selectedDeliveryArea];
  const total = subtotal + deliveryFee + SERVICE_FEE;

  document.getElementById("paymentAmount").textContent = total.toLocaleString();

  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("bankModal").style.display = "block";

  // Reset and re-attach the checkbox event listener
  const checkbox = document.getElementById("paymentConfirmed");
  checkbox.checked = false;
  document.getElementById("confirmOrderBtn").disabled = true;

  checkbox.onchange = function () {
    document.getElementById("confirmOrderBtn").disabled = !this.checked;
  };
}

function closeBankDetails() {
  document.getElementById("bankModal").style.display = "none";
  hideOverlay();
}

// Function to generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `CQB${timestamp}${random}`;
}

function formatOrderItemsForEmail(cart) {
  return cart
    .map(
      (item) => `
      <div class="order-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #e0e0e0; gap: 15px;">
            <div style="flex: 1;">
                <strong style="color: #333; font-size: 14px; display: block; margin-bottom: 4px;">${
                  item.quantity
                }x ${item.name}</strong>
                ${
                  item.restaurant
                    ? `<br><small style="color: #666; font-size: 12px; font-style: italic;">Restaurant: ${item.restaurant}</small>`
                    : ""
                }
            </div>
            <div style="font-weight: 600; color: #ee5a24; white-space: nowrap; font-size: 14px; min-width: 80px; text-align: right;">
                ₦${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `
    )
    .join("");
}

// Function to send order email
async function sendOrderEmail(orderData) {
  try {
    console.log("Sending order email...", orderData);

    // Check if EmailJS is available
    if (typeof emailjs === "undefined") {
      throw new Error("EmailJS library not loaded");
    }

    // Prepare email parameters
    const templateParams = {
      order_number: orderData.orderNumber,
      order_time: new Date().toLocaleString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail || "Not provided",
      delivery_address: orderData.deliveryAddress,
      delivery_area: orderData.deliveryArea,
      order_items: orderData.orderItems,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      service_fee: orderData.serviceFee,
      total_amount: orderData.totalAmount,
      bank_name: orderData.bankName,
      account_name: orderData.accountName,
      account_number: orderData.accountNumber,
    };

    console.log("EmailJS template parameters:", templateParams);

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log("Email sent successfully:", response);
    return {
      success: true,
      message: "Order confirmation email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      message: "Failed to send confirmation email: " + error.message,
    };
  }
}

// Enhanced submitOrder function with email integration
async function submitOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerEmail = document.getElementById("customerEmail").value.trim();
  const customerAddress = document
    .getElementById("customerAddress")
    .value.trim();

  // Validate required fields
  if (!customerName || !customerPhone || !customerAddress) {
    alert("Please fill in all required fields: Name, Phone, and Address.");
    return;
  }

  // Get bank details from the modal
  const bankName =
    document.querySelector(".bank-details .account-option h3")?.textContent ||
    "Zenith Bank";
  const accountName =
    document
      .querySelector(".bank-details .account-option p:nth-child(2)")
      ?.textContent?.replace("Account Name:", "")
      .trim() || "CALABAR QUICKBITE ENTERPRISES";
  const accountNumber =
    document
      .querySelector(".bank-details .account-option p:nth-child(3)")
      ?.textContent?.replace("Account Number:", "")
      .trim() || "2083456719";

  // Calculate final total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEES[selectedDeliveryArea] || 0;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  // Generate order number
  const orderNumber = generateOrderNumber();

  // Generate order data
  const orderData = {
    orderNumber: orderNumber,
    customerName: customerName,
    customerPhone: customerPhone,
    customerEmail: customerEmail || "Not provided",
    deliveryAddress: customerAddress,
    deliveryArea: getDeliveryAreaName(selectedDeliveryArea),
    orderItems: formatOrderItemsForEmail(cart),
    subtotal: `₦${subtotal.toLocaleString()}`,
    deliveryFee: `₦${deliveryFee.toLocaleString()}`,
    serviceFee: `₦${SERVICE_FEE.toLocaleString()}`,
    totalAmount: `₦${total.toLocaleString()}`,
    bankName: bankName,
    accountName: accountName,
    accountNumber: accountNumber,
    cartItems: JSON.parse(JSON.stringify(cart)), // Deep copy of cart
  };

  // Show loading state
  const confirmBtn = document.getElementById("confirmOrderBtn");
  const originalText = confirmBtn.textContent;
  confirmBtn.textContent = "Sending Order...";
  confirmBtn.disabled = true;

  try {
    // Send email
    const emailResult = await sendOrderEmail(orderData);

    // Also save order to localStorage as backup
    saveOrderToLocalStorage(orderData);

    // Create order summary for display
    const orderDetails = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - ₦${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    // Populate success modal
    document.getElementById("successCustomerName").textContent = customerName;
    document.getElementById("successAddress").textContent = customerAddress;
    document.getElementById("successPhone").textContent = customerPhone;
    document.getElementById("successSubtotal").textContent =
      subtotal.toLocaleString();
    document.getElementById("successDeliveryFee").textContent =
      deliveryFee.toLocaleString();
    document.getElementById("successServiceFee").textContent =
      SERVICE_FEE.toLocaleString();
    document.getElementById("successTotal").textContent =
      total.toLocaleString();
    document.getElementById("successOrderNumber").textContent = orderNumber;

    // Populate order items
    const successOrderItems = document.getElementById("successOrderItems");
    successOrderItems.innerHTML = cart
      .map(
        (item) => `
        <div class="summary-item">
            <span class="item-quantity">${item.quantity}x</span>
            <span class="item-name">${item.name}</span>
            <span class="item-price">₦${(
              item.price * item.quantity
            ).toLocaleString()}</span>
        </div>
    `
      )
      .join("");

    // Show success modal
    document.getElementById("bankModal").style.display = "none";
    document.getElementById("successModal").style.display = "block";

    // Clear cart and reset
    clearCart();
    document.getElementById("checkoutForm").reset();

    // Show thank you message
    showNotification("Order placed successfully! We'll contact you soon.");

    // Log email result
    if (!emailResult.success) {
      console.warn("Email sending failed:", emailResult.message);
    }
  } catch (error) {
    console.error("Order submission error:", error);
    alert(
      "There was an issue submitting your order. Please try again or contact support. Error: " +
        error.message
    );
  } finally {
    // Reset button state
    confirmBtn.textContent = originalText;
    confirmBtn.disabled = false;
  }
}

// Function to save order to localStorage as backup
function saveOrderToLocalStorage(orderData) {
  try {
    const orders =
      JSON.parse(localStorage.getItem("calabarQuickBiteOrders")) || [];
    orders.push({
      ...orderData,
      timestamp: new Date().toISOString(),
      status: "pending",
    });

    // Keep only last 50 orders to prevent storage overflow
    if (orders.length > 50) {
      orders.splice(0, orders.length - 50);
    }

    localStorage.setItem("calabarQuickBiteOrders", JSON.stringify(orders));
    console.log("Order saved to localStorage:", orderData.orderNumber);
  } catch (error) {
    console.error("Failed to save order to localStorage:", error);
  }
}

// Function to get delivery area name
function getDeliveryAreaName(area) {
  const names = {
    METROPOLIS: "Metropolis Area - ₦2,500",
    SUB_METROPOLIS: "Sub-Metropolis Area - ₦3,500",
    OUTSKIRTS: "Outskirts Area - ₦4,500",
  };
  return names[area] || area;
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
  hideOverlay();
}

function closeAllModals() {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("bankModal").style.display = "none";
  document.getElementById("successModal").style.display = "none";
  hideOverlay();

  const menuModal = document.querySelector(".menu-modal");
  if (menuModal) {
    menuModal.remove();
  }
}

function clearCart() {
  cart = [];
  selectedDeliveryArea = null;
  updateCartCount();
  updateCartDisplay();
  saveCartToStorage();
}

function setLocation() {
  const addressInput = document.getElementById("deliveryAddress");
  if (addressInput.value.trim()) {
    showNotification(`Location set to: ${addressInput.value}`);
  } else {
    alert("Please enter your delivery address.");
  }
}

function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
  // Only hide overlay if no modals are open
  const modals = document.querySelectorAll(".modal");
  const isAnyModalOpen = Array.from(modals).some(
    (modal) => modal.style.display === "block"
  );

  if (!isAnyModalOpen) {
    document.getElementById("overlay").style.display = "none";
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Smooth scroll for footer links
document.addEventListener("DOMContentLoaded", function () {
  // Add smooth scrolling to footer links
  const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');

  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
