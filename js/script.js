// Delivery fee configuration
const DELIVERY_FEES = {
  METROPOLIS: 2500,
  SUB_METROPOLIS: 3500,
  OUTSKIRTS: 4500,
};

const SERVICE_FEE = 300;

// Sample restaurant data (in real scenario, this would be in restaurants.json)
const restaurants = [
  {
    id: 1,
    name: "Crispy Chicken",
    description: "Finger lickin' good!",
    image: "img/crispy.jpg",
    fallback: "🍗",
    deliveryTime: "25-35min",
    rating: "4.5",
    featured: true,
    category: "fastfood",
    menu: [
      {
        id: 1,
        name: "3 Pieces Chicken Meal",
        description: "3 pieces chicken + fries + drink",
        price: 3500,
        image: "img/crispy/3piece.jpg",
      },
      {
        id: 2,
        name: "Zinger Burger Meal",
        description: "Zinger burger + fries + drink",
        price: 3200,
        image: "images/restaurants/kfc-burger.jpg",
      },
      {
        id: 3,
        name: "Chicken Bucket (8 pcs)",
        description: "8 pieces of original recipe chicken",
        price: 8500,
        image: "images/restaurants/kfc-bucket.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "Domino's Pizza",
    description: "Pizza delivery experts",
    image: "img/dominos.jpg",
    fallback: "🍕",
    deliveryTime: "35-40min",
    rating: "4.5",
    popular: true,
    category: "fastfood",
    menu: [
      {
        id: 4,
        name: "Medium Pepperoni Pizza",
        description: "12-inch pepperoni pizza",
        price: 5500,
        image: "img/dominos/mediumpeperoni.jpg",
      },
      {
        id: 5,
        name: "Large Supreme Pizza",
        description: "14-inch supreme pizza",
        price: 7500,
        image: "images/restaurants/dominos-supreme.jpg",
      },
      {
        id: 6,
        name: "Garlic Bread",
        description: "8 pieces garlic bread",
        price: 1800,
        image: "images/restaurants/dominos-garlic-bread.jpg",
      },
    ],
  },
  {
    id: 3,
    name: "Chicken Republic",
    description: "Simply irresistible!",
    image: "img/chickenrepublic.jpg",
    fallback: "🍗",
    deliveryTime: "25-35min",
    rating: "4.5",
    popular: true,
    category: "fastfood",
    menu: [
      {
        id: 7,
        name: "Quarter Chicken Meal",
        description: "Quarter chicken + jollof rice + drink",
        price: 2800,
        image: "images/restaurants/cr-chicken.jpg",
      },
      {
        id: 8,
        name: "Spicy Chicken Burger",
        description: "Spicy chicken burger + fries",
        price: 2200,
        image: "images/restaurants/cr-burger.jpg",
      },
    ],
  },
  {
    id: 4,
    name: "Crunchies Fried Chicken",
    description: "Taste the difference",
    image: "img/crunchies.jpg",
    fallback: "🍔",
    deliveryTime: "25-35min",
    rating: "4.5",
    featured: true,
    category: "fastfood",
    menu: [
      {
        id: 9,
        name: "Bigga Burger Meal",
        description: "Bigga burger + fries + drink",
        price: 2500,
        image: "images/restaurants/biggs-burger.jpg",
      },
      {
        id: 10,
        name: "Meat Pie Combo",
        description: "2 meat pies + drink",
        price: 1500,
        image: "images/restaurants/biggs-pie.jpg",
      },
    ],
  },
  {
    id: 5,
    name: "Alyce Ice Cream & Snacks",
    description: "Delight in every bite",
    image: "img/alyce.jpg",
    fallback: "🍔",
    deliveryTime: "25-35min",
    rating: "4.5",
    featured: true,
    category: "deserts",
    menu: [
      {
        id: 10,
        name: "Bigga Burger Meal",
        description: "Bigga burger + fries + drink",
        price: 2500,
        image: "images/restaurants/biggs-burger.jpg",
      },
      {
        id: 11,
        name: "Meat Pie Combo",
        description: "2 meat pies + drink",
        price: 1500,
        image: "images/restaurants/biggs-pie.jpg",
      },
    ],
  },
  {
    id: 6,
    name: "8tte's Chops & Grills",
    description: "Finest of chops & grills",
    image: "img/8tte.jpg",
    fallback: "🍔",
    deliveryTime: "25-35min",
    rating: "4.5",
    popular: true,
    category: "deserts",
    menu: [
      {
        id: 13,
        name: "Sam & Puff Pack",
        description: "8 piece samosa + 8 piece puff-puff",
        price: 2500,
        image: "images/restaurants/biggs-burger.jpg",
      },
      {
        id: 14,
        name: "Meat Pie Combo",
        description: "2 meat pies + drink",
        price: 1500,
        image: "images/restaurants/biggs-pie.jpg",
      },
    ],
  },
];

let cart = [];
let currentRestaurant = null;
let selectedDeliveryArea = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadCartFromStorage();
  loadRestaurants();
  updateCartCount();
  updateCartDisplay();
});

// Local Storage Functions
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
                })">Order Now</button>
            </div>
        `;
    restaurantsList.appendChild(restaurantCard);
  });
}

function showMenu(restaurantId) {
  currentRestaurant = restaurants.find((r) => r.id === restaurantId);

  const menuModal = document.createElement("div");
  menuModal.className = "menu-modal";
  menuModal.innerHTML = `
        <div class="menu-header">
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
                        <span class="item-price">₦${item.price}</span>
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
                <p class="item-price">₦${item.price} × ${item.quantity} = ₦${itemTotal}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
    cartItems.appendChild(cartItem);
  });

  // Calculate total - only add delivery fee if area is selected
  const deliveryFee = selectedDeliveryArea
    ? DELIVERY_FEES[selectedDeliveryArea]
    : 0;
  const total = subtotal;

  cartTotal.textContent = total.toLocaleString();
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
  const deliveryFee = 0; // Start with 0 until area selected
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
                ? `(${getDeliveryArea(selectedDeliveryArea)})`
                : "(Included in next screen)"
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

// Updated showBankDetails function with delivery fee validation
function showBankDetails() {
  const form = document.getElementById("checkoutForm");
  const customerName = document.getElementById("customerName").value;
  const customerAddress = document.getElementById("customerAddress").value;
  const customerPhone = document.getElementById("customerPhone").value;

  if (!customerName || !customerAddress || !customerPhone) {
    alert(
      "Please fill in all required fields: Name, Address, and Phone Number."
    );
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

function submitOrder() {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerAddress = document.getElementById("customerAddress").value;

  // Calculate final total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = DELIVERY_FEES[selectedDeliveryArea] || 0;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  // Generate random order number
  const orderNumber = "CB" + Date.now().toString().slice(-6);

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
  document.getElementById("successTotal").textContent = total.toLocaleString();
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

  // Reset payment confirmation
  document.getElementById("paymentConfirmed").checked = false;
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
  hideOverlay();
}

// Update the closeAllModals function to include success modal
function closeAllModals() {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("bankModal").style.display = "none";
  document.getElementById("successModal").style.display = "none";
  hideOverlay();

  const menuModal = document.querySelector(".menu-modal");
  if (menuModal) {
    menuModal.remove();
  }

  // Clear cart and reset
  clearCart();
  document.getElementById("checkoutForm").reset();
  closeBankDetails();

  showNotification("Order placed successfully! We'll contact you soon.");
}

function clearCart() {
  cart = [];
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

function closeAllModals() {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("bankModal").style.display = "none";
  hideOverlay();

  // Also close any menu modals
  const menuModal = document.querySelector(".menu-modal");
  if (menuModal) {
    menuModal.remove();
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
