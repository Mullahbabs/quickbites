// EmailJS Configuration for Uyo Launch List
const UYO_EMAILJS_CONFIG = {
  SERVICE_ID: "service_1addu86",
  TEMPLATE_ID: "template_3sbuxvb",
  PUBLIC_KEY: "Syl6_Q_1-IlMBpDug",
};

// Track modal state to prevent duplication
let uyoModalIsOpen = false;
let emailJSHasLoaded = false;

// Function to initialize EmailJS
function initializeUyoEmailJS() {
  if (typeof emailjs !== "undefined") {
    emailjs.init(UYO_EMAILJS_CONFIG.PUBLIC_KEY);
    emailJSHasLoaded = true;
    console.log("Uyo EmailJS initialized successfully");
  } else {
    console.error("EmailJS library not loaded");
    loadEmailJSDynamically();
  }
}

// Dynamically load EmailJS if not present
function loadEmailJSDynamically() {
  if (typeof emailjs !== "undefined") return;

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  script.onload = () => {
    initializeUyoEmailJS();
  };
  script.onerror = () => {
    console.error("Failed to load EmailJS library");
  };
  document.head.appendChild(script);
}

// Email validation
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// City selection handler
function selectCity(city) {
  if (city === "Calabar") {
    showCalabarLoading();
  } else if (city === "Uyo") {
    showUyoEmailModal();
  }
}

// Calabar loading animation and redirect
function showCalabarLoading() {
  const buttons = document.querySelectorAll(".city-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.classList.contains("calabar")) {
      btn.innerHTML = `
        <div class="city-icon">⏳</div>
        <div>LOADING CALABAR...</div>
        <div class="subtext">Preparing your food journey</div>
      `;
    }
  });

  setTimeout(() => {
    window.location.href = "calabar.html";
  }, 1500);
}

// Show Uyo email modal (with duplication protection)
function showUyoEmailModal() {
  // Prevent opening multiple modals
  if (uyoModalIsOpen || document.getElementById("uyoModal")) {
    return;
  }

  uyoModalIsOpen = true;

  const modalHTML = `
    <div id="uyoModal" class="uyo-modal-backdrop">
      <div class="uyo-modal-content">
        <button class="uyo-close-btn" onclick="closeUyoModal()">×</button>
        
        <div class="uyo-modal-header">
          <div class="uyo-icon">🌆</div>
          <h2>Uyo Launch Coming Soon!</h2>
          <p>We're expanding to Uyo! Be the first to know when QuickBites launches in the Land of Promise.</p>
        </div>
        
        <form id="uyoEmailForm">
          <div class="uyo-input-wrapper">
            <input type="email" id="uyoEmail" placeholder="Enter your email address" required autocomplete="email">
            <div id="emailError" class="uyo-error"></div>
          </div>
          
          <button type="submit" id="submitUyoBtn">
            Notify Me at Launch
          </button>
        </form>
        
        <div class="uyo-footer-text">
          <p>✨ Early subscribers get special launch discounts!</p>
          <p>We respect your privacy. No spam, ever.</p>
        </div>
      </div>
    </div>

    <style>
      .uyo-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: uyoFadeIn 0.3s ease;
      }
      .uyo-modal-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        padding: 2.5rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        border: 2px solid #2196F3;
        box-shadow: 0 20px 60px rgba(33,150,243,0.3);
        position: relative;
        animation: uyoSlideUp 0.4s ease;
      }
      .uyo-close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      .uyo-close-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .uyo-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
      }
      .uyo-modal-header h2 {
        color: white;
        font-size: 1.8rem;
        margin: 0.5rem 0;
      }
      .uyo-modal-header p {
        color: rgba(255,255,255,0.8);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      .uyo-input-wrapper {
        margin-bottom: 1rem;
      }
      #uyoEmail {
        width: 100%;
        padding: 15px;
        border: 2px solid rgba(33,150,243,0.3);
        border-radius: 10px;
        background: rgba(255,255,255,0.1);
        color: white;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s;
        box-sizing: border-box;
      }
      #uyoEmail:focus {
        border-color: #2196F3;
        box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
      }
      .uyo-error {
        color: #ff6b6b;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        text-align: left;
        display: none;
        min-height: 20px;
      }
      #submitUyoBtn {
        background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: transform 0.3s, box-shadow 0.3s;
        box-sizing: border-box;
      }
      #submitUyoBtn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(33,150,243,0.4);
      }
      #submitUyoBtn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
      .uyo-footer-text {
        font-size: 0.9rem;
        color: rgba(255,255,255,0.6);
        margin-top: 1.5rem;
        line-height: 1.5;
      }
      @keyframes uyoFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes uyoSlideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes uyoSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes uyoFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      .uyo-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-radius: 50%;
        border-top-color: transparent;
        animation: uyoSpin 0.8s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
      }
    </style>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Set up form submission handler
  const emailForm = document.getElementById("uyoEmailForm");
  if (emailForm) {
    emailForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleUyoEmailSubmit();
    });
  }

  const emailInput = document.getElementById("uyoEmail");

  // Focus input
  setTimeout(() => {
    if (emailInput) {
      emailInput.focus();
    }
  }, 300);

  // Ensure EmailJS is initialized
  if (!emailJSHasLoaded) {
    initializeUyoEmailJS();
  }

  // Add click outside to close functionality
  const modal = document.getElementById("uyoModal");
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeUyoModal();
      }
    });
  }

  // Add escape key to close
  document.addEventListener("keydown", handleUyoModalEscapeKey);
}

// Handle escape key for modal
function handleUyoModalEscapeKey(event) {
  if (event.key === "Escape" && uyoModalIsOpen) {
    closeUyoModal();
  }
}

// Handle email submission
async function handleUyoEmailSubmit() {
  const emailInput = document.getElementById("uyoEmail");
  const errorEl = document.getElementById("emailError");
  const submitBtn = document.getElementById("submitUyoBtn");

  if (!emailInput || !submitBtn) return;

  const email = emailInput.value.trim();
  const originalText = submitBtn.textContent;

  // Reset error
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.textContent = "";
  }

  // Validation
  if (!email) {
    if (errorEl) {
      errorEl.textContent = "Please enter your email address";
      errorEl.style.display = "block";
    }
    return;
  }

  if (!validateEmail(email)) {
    if (errorEl) {
      errorEl.textContent = "Please enter a valid email address";
      errorEl.style.display = "block";
    }
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="uyo-spinner"></span>
    Submitting...
  `;

  try {
    if (typeof emailjs === "undefined") {
      throw new Error("EmailJS not loaded");
    }

    const templateParams = {
      email: email,
      date_subscribed: new Date().toLocaleString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      city: "Uyo",
      source: "QuickBites Landing Page",
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    await emailjs.send(
      UYO_EMAILJS_CONFIG.SERVICE_ID,
      UYO_EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    showUyoSuccessMessage(email);
    saveUyoEmailToLocalStorage(email);
  } catch (err) {
    console.error("Email submission failed:", err);
    if (errorEl) {
      errorEl.textContent = "Failed to submit. Please try again later.";
      errorEl.style.display = "block";
    }
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    saveUyoEmailToLocalStorage(email); // fallback to localStorage
  }
}

// Show success state (replaces modal content)
function showUyoSuccessMessage(email) {
  const modalContent = document.querySelector("#uyoModal .uyo-modal-content");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
      <h2 style="color: white; font-size: 1.8rem; margin-bottom: 0.5rem;">You're On The List!</h2>
      <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
        Thank you <strong>${email}</strong>! We've added you to our Uyo launch notification list.
      </p>
      <div style="background: rgba(76,175,80,0.1); padding: 1rem; border-radius: 10px; margin: 1.5rem 0;">
        <p style="color: #4CAF50; font-size: 0.9rem; margin: 0; line-height: 1.6;">
          ✅ You'll be among the first to know when we launch in Uyo<br>
          ✅ Exclusive launch discounts await<br>
          ✅ Early access to restaurant partnerships
        </p>
      </div>
    </div>
    
    <button id="closeSuccessBtn" style="
      background: #4CAF50;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, background-color 0.3s;
      width: 100%;
      box-sizing: border-box;">
      Awesome, Close This
    </button>
    
    <div style="margin-top: 1.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.6);">
      Follow us on social media for updates!
    </div>
  `;

  // Add event listener to the new close button
  const closeBtn = document.getElementById("closeSuccessBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeUyoModal);
  }
}

// Close modal with fade out
function closeUyoModal() {
  const modal = document.getElementById("uyoModal");
  if (!modal) {
    uyoModalIsOpen = false;
    return;
  }

  modal.style.animation = "uyoFadeOut 0.3s ease forwards";

  setTimeout(() => {
    modal.remove();
    uyoModalIsOpen = false;

    // Remove escape key listener
    document.removeEventListener("keydown", handleUyoModalEscapeKey);
  }, 300);
}

// LocalStorage backup
function saveUyoEmailToLocalStorage(email) {
  try {
    let list = JSON.parse(localStorage.getItem("quickbitesUyoEmails") || "[]");
    if (!list.some((e) => e.email === email)) {
      list.push({
        email: email,
        date: new Date().toISOString(),
        city: "Uyo",
        synced: false, // Mark for later sync if needed
      });

      // Limit storage to 1000 entries
      if (list.length > 1000) {
        list = list.slice(-1000);
      }

      localStorage.setItem("quickbitesUyoEmails", JSON.stringify(list));
      console.log("Email saved to localStorage:", email);
    }
  } catch (e) {
    console.error("localStorage save failed:", e);
  }
}

// DOM ready initialization
document.addEventListener("DOMContentLoaded", () => {
  initializeUyoEmailJS();

  // Use event delegation for city buttons to prevent multiple bindings
  document.addEventListener("click", (event) => {
    const target = event.target;

    // Handle clicks on city buttons
    const cityBtn = target.closest(".city-btn");
    if (cityBtn) {
      event.preventDefault();

      // Add a small delay to prevent rapid multiple clicks
      if (cityBtn.classList.contains("click-processing")) {
        return;
      }

      cityBtn.classList.add("click-processing");

      if (cityBtn.classList.contains("calabar")) {
        selectCity("Calabar");
      } else if (cityBtn.classList.contains("uyo")) {
        selectCity("Uyo");
      }

      // Remove processing class after delay
      setTimeout(() => {
        cityBtn.classList.remove("click-processing");
      }, 1000);
    }

    // Handle clicks on close buttons
    if (target.closest(".uyo-close-btn")) {
      closeUyoModal();
    }
  });

  // Hover effects - attach once
  document.querySelectorAll(".city-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (!btn.disabled) {
        btn.style.transform = "scale(1.05)";
      }
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });

  // Fallback load check
  setTimeout(() => {
    if (typeof emailjs === "undefined") {
      loadEmailJSDynamically();
    }
  }, 3000);
});

// Global functions
window.selectCity = selectCity;
window.closeUyoModal = closeUyoModal;
window.handleUyoEmailSubmit = handleUyoEmailSubmit;

// Parallax effect (kept as in original)
window.addEventListener("mousemove", (e) => {
  const elements = document.querySelectorAll(".floating-element");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  elements.forEach((el, i) => {
    const speed = 0.5 + i * 0.1;
    el.style.transform = `translate(${(x - 0.5) * 20 * speed}px, ${
      (y - 0.5) * 20 * speed
    }px)`;
  });
});

// Add CSS for click processing
const clickProcessingStyle = document.createElement("style");
clickProcessingStyle.textContent = `
  .city-btn.click-processing {
    pointer-events: none;
    opacity: 0.8;
  }
`;
document.head.appendChild(clickProcessingStyle);
