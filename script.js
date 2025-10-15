// Sample restaurant data (in real scenario, this would be in restaurants.json)
const restaurants = [
  {
    id: 1,
    name: "SFC Calabar",
    description: "Finger lickin' good!",
    image: "🍗",
    menu: [
      {
        id: 1,
        name: "3 Pieces Chicken Meal",
        description: "3 pieces chicken + fries + drink",
        price: 3500,
      },
      {
        id: 2,
        name: "Zinger Burger Meal",
        description: "Zinger burger + fries + drink",
        price: 3200,
      },
      {
        id: 3,
        name: "Chicken Bucket (8 pcs)",
        description: "8 pieces of original recipe chicken",
        price: 8500,
      },
    ],
  },
  {
    id: 2,
    name: "Domino's Pizza",
    description: "Pizza delivery experts",
    image: "🍕",
    menu: [
      {
        id: 4,
        name: "Medium Pepperoni Pizza",
        description: "12-inch pepperoni pizza",
        price: 5500,
      },
      {
        id: 5,
        name: "Large Supreme Pizza",
        description: "14-inch supreme pizza",
        price: 7500,
      },
      {
        id: 6,
        name: "Garlic Bread",
        description: "8 pieces garlic bread",
        price: 1800,
      },
    ],
  },
  {
    id: 3,
    name: "Chicken Republic",
    description: "Simply irresistible!",
    image: "🍗",
    menu: [
      {
        id: 7,
        name: "Quarter Chicken Meal",
        description: "Quarter chicken + jollof rice + drink",
        price: 2800,
      },
      {
        id: 8,
        name: "Spicy Chicken Burger",
        description: "Spicy chicken burger + fries",
        price: 2200,
      },
    ],
  },
  {
    id: 4,
    name: "Crispy Chicken",
    description: "Taste the difference",
    image: "🍔",
    menu: [
      {
        id: 9,
        name: "Bigga Burger Meal",
        description: "Bigga burger + fries + drink",
        price: 2500,
      },
      {
        id: 10,
        name: "Meat Pie Combo",
        description: "2 meat pies + drink",
        price: 1500,
      },
    ],
  },
];

let cart = [];
let currentRestaurant = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadRestaurants();
  updateCartCount();
});

function loadRestaurants() {
  const restaurantsList = document.getElementById("restaurantsList");
  restaurantsList.innerHTML = "";

  restaurants.forEach((restaurant) => {
    const restaurantCard = document.createElement("div");
    restaurantCard.className = "restaurant-card";
    restaurantCard.innerHTML = `
            <div class="restaurant-image">${restaurant.image}</div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <button class="menu-btn" onclick="showMenu(${restaurant.id})">View Menu</button>
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
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                    </div>
                    <div class="item-actions">
                        <span class="item-price">₦${item.price}</span>
                        <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
                    </div>
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

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

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

  cartTotal.textContent = total;
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
    }
  }
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCartCount();
  updateCartDisplay();
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
  const orderTotal = document.getElementById("orderTotal");

  // Populate order summary
  orderSummary.innerHTML = cart
    .map(
      (item) => `
        <div class="order-item">
            ${item.quantity}x ${item.name} - ₦${item.price * item.quantity}
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotal.textContent = total;

  // Pre-fill address if set
  const deliveryAddress = document.getElementById("deliveryAddress").value;
  if (deliveryAddress) {
    document.getElementById("customerAddress").value = deliveryAddress;
  }

  checkoutModal.style.display = "block";
  showOverlay();
  toggleCart(); // Close cart sidebar
}

function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
  hideOverlay();
}

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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("paymentAmount").textContent = total;

  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("bankModal").style.display = "block";

  // Enable/disable confirmation button based on checkbox
  document
    .getElementById("paymentConfirmed")
    .addEventListener("change", function () {
      document.getElementById("confirmOrderBtn").disabled = !this.checked;
    });
}

function closeBankDetails() {
  document.getElementById("bankModal").style.display = "none";
  hideOverlay();
}

function submitOrder() {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerEmail = document.getElementById("customerEmail").value;

  // Create order summary
  const orderDetails = cart
    .map(
      (item) =>
        `${item.quantity}x ${item.name} - ₦${item.price * item.quantity}`
    )
    .join("\n");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Show confirmation (in real app, this would send to backend)
  alert(
    `🎉 Order Submitted!\n\nThank you ${customerName}!\n\nWe've received your order and payment confirmation.\nWe'll SMS you at ${customerPhone} when your order is on the way!\n\nOrder Summary:\n${orderDetails}\n\nTotal: ₦${total}`
  );

  // Reset everything
  cart = [];
  updateCartCount();
  updateCartDisplay();
  document.getElementById("checkoutForm").reset();
  closeBankDetails();

  // Show thank you message
  showNotification("Order placed successfully! We'll contact you soon.");

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
    document.getElementById("overlay").style.display = "none";
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
    // Create notification element
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

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Add some CSS for the notification animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
  document.head.appendChild(style);

  // Show thank you message
  showNotification("Order placed successfully! We'll contact you soon.");
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
  document.getElementById("overlay").style.display = "none";
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
  // Create notification element
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

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add some CSS for the notification animation
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
