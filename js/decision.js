// Decision Maker Logic
const decisionMaker = {
  // Food preferences database
  foodPreferences: {
    breakfast: [
      "pancakes",
      "waffles",
      "omelette",
      "cereal",
      "toast",
      "porridge",
      "smoothie",
      "yogurt",
    ],
    lunch: [
      "sandwich",
      "salad",
      "soup",
      "shawarma",
      "burger",
      "pasta",
      "rice",
      "noodles",
    ],
    dinner: [
      "beans",
      "chicken",
      "fish",
      "pizza",
      "curry",
      "stir-fry",
      "Bole and fish",
      "moi-moi",
    ],
    snack: [
      "chips",
      "fruits",
      "nuts",
      "cookies",
      "chocolate",
      "yogurt",
      "popcorn",
      "Parfeit",
    ],

    hot: [
      "salad",
      "smoothie",
      "ice cream",
      "sandwich",
      "fruit salad",
      "parfeit",
      "yogurt",
    ],
    cold: [
      "soup",
      "stew",
      "hot chocolate",
      "curry soup",
      "casserole",
      "porridge",
      "tea",
      "coffee",
    ],
    rainy: [
      "soup",
      "grilled fish",
      "mac and sauce",
      "hot chocolate",
      "comfort food",
    ],
    any: ["anything", "surprise me", "chef special"],

    home: ["home cooked", "comfort food", "family style", "experimental"],
    office: ["quick", "neat", "portable", "sandwich", "shawarma", "salad"],
    outdoors: ["portable", "finger food", "pasta", "bbq", "grilled"],
    indoors: ["fast food", "snacks", "energy bars", "hot food"],
  },

  selectedFactors: {
    mealType: null,
    weather: null,
    location: null,
  },

  userOptions: {
    option1: "",
    option2: "",
  },

  init() {
    this.bindEvents();
    console.log("Meal Decision Maker initialized");
  },

  bindEvents() {
    // Floating button
    document
      .getElementById("decisionMakerBtn")
      ?.addEventListener("click", () => this.openModal());

    // Close modal
    document
      .getElementById("closeDecisionModal")
      ?.addEventListener("click", () => this.closeModal());

    // Step 1 - Next (requires both options)
    document.getElementById("nextStep1")?.addEventListener("click", () => {
      if (this.validateOptions()) {
        this.collectOptions();
        this.goToStep(2);
      }
    });

    // Step 1 - I'm Feeling Lucky (skips options input)
    document.getElementById("skipOptions")?.addEventListener("click", () => {
      this.useRandomOptions();
      this.goToStep(2);
    });

    // Step 2 - Back
    document
      .getElementById("prevStep2")
      ?.addEventListener("click", () => this.goToStep(1));

    // Step 2 - Next (requires all factors)
    document.getElementById("nextStep2")?.addEventListener("click", () => {
      if (this.validateFactors()) {
        this.goToStep(3);
        this.startDecisionProcess();
      }
    });

    // Factor selection
    document.querySelectorAll(".factor-option").forEach((option) => {
      option.addEventListener("click", (e) =>
        this.selectFactor(e.currentTarget)
      );
    });

    // Step 3 - Cancel
    document
      .getElementById("cancelDecision")
      ?.addEventListener("click", () => this.goToStep(2));

    // Step 4 - Restart
    document
      .getElementById("restartDecision")
      ?.addEventListener("click", () => {
        this.resetDecision();
        this.goToStep(1);
      });

    // Step 4 - Order Now
    document
      .getElementById("orderNowBtn")
      ?.addEventListener("click", () => this.orderSelectedFood());
  },

  openModal() {
    const modal = document.getElementById("decisionModal");
    if (modal) {
      modal.classList.add("active");
      this.resetDecision();
    }
  },

  closeModal() {
    const modal = document.getElementById("decisionModal");
    if (modal) modal.classList.remove("active");
  },

  goToStep(stepNumber) {
    document.querySelectorAll(".decision-step").forEach((step) => {
      step.classList.remove("active");
    });

    const target = document.getElementById(`step${stepNumber}`);
    if (target) target.classList.add("active");
  },

  validateOptions() {
    const option1 = document.getElementById("option1")?.value.trim();
    const option2 = document.getElementById("option2")?.value.trim();
    const errorEl = document.getElementById("optionsError");

    if (!option1 || !option2) {
      if (errorEl) {
        errorEl.textContent =
          "Both options are required! Please fill in both fields.";
        errorEl.style.display = "block";
      }
      return false;
    }

    if (errorEl) errorEl.style.display = "none";
    return true;
  },

  collectOptions() {
    const option1 = document
      .getElementById("option1")
      ?.value.trim()
      .toLowerCase();
    const option2 = document
      .getElementById("option2")
      ?.value.trim()
      .toLowerCase();

    if (option1 && option2) {
      this.userOptions.option1 = option1;
      this.userOptions.option2 = option2;
    }
  },

  useRandomOptions() {
    const allOptions = [
      "burger",
      "pizza",
      "pasta",
      "shawarma",
      "ekpang",
      "salad",
      "sandwich",
      "soup",
      "bole and fish",
      "chicken",
      "fish",
      "curry",
      "indomie",
      "buns",
      "noodles",
      "rice",
      "stir-fry",
      "beans",
    ];

    const randomIndex1 = Math.floor(Math.random() * allOptions.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * allOptions.length);
    } while (randomIndex2 === randomIndex1);

    this.userOptions.option1 = allOptions[randomIndex1];
    this.userOptions.option2 = allOptions[randomIndex2];

    // Optional: Show the random choices to user
    document.getElementById("option1").value = this.capitalizeFirstLetter(
      this.userOptions.option1
    );
    document.getElementById("option2").value = this.capitalizeFirstLetter(
      this.userOptions.option2
    );
  },

  selectFactor(element) {
    const factorValue = element.getAttribute("data-factor");
    const category = this.getFactorCategory(factorValue);

    if (!category) return;

    // Deselect others in same category
    document
      .querySelectorAll(`.factor-option[data-factor]`)
      .forEach((factor) => {
        const cat = this.getFactorCategory(factor.getAttribute("data-factor"));
        if (cat === category) factor.classList.remove("selected");
      });

    element.classList.add("selected");
    this.selectedFactors[category] = factorValue;
  },

  getFactorCategory(value) {
    if (["breakfast", "lunch", "dinner", "snack"].includes(value))
      return "mealType";
    if (["hot", "cold", "rainy", "any"].includes(value)) return "weather";
    if (["home", "office", "outdoors", "indoors"].includes(value))
      return "location";
    return null;
  },

  validateFactors() {
    const { mealType, weather, location } = this.selectedFactors;

    if (!mealType || !weather || !location) {
      alert(
        "Please select one option from each category (Meal Type, Weather & Location)!"
      );
      return false;
    }
    return true;
  },

  startDecisionProcess() {
    const consideringText = document.getElementById("consideringFactor");
    if (!consideringText) return;

    const factors = [
      "Meal Type",
      "Weather",
      "Location",
      "Your Preferences",
      "Time of Day",
      "Hunger Level",
    ];
    let i = 0;

    const interval = setInterval(() => {
      consideringText.textContent = factors[i];
      i = (i + 1) % factors.length;
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      this.makeDecision();
      this.goToStep(4);
    }, 5000);
  },

  makeDecision() {
    const { option1, option2 } = this.userOptions;

    const score1 = this.calculateScore(option1);
    const score2 = this.calculateScore(option2);

    const randomFactor = Math.random() * 0.3;
    let selectedOption, reason;

    if (score1 + randomFactor > score2) {
      selectedOption = option1;
      reason = this.generateReason(option1, score1, score2);
    } else {
      selectedOption = option2;
      reason = this.generateReason(option2, score2, score1);
    }

    this.displayResult(selectedOption, reason);
  },

  calculateScore(option) {
    let score = 0;

    const checkMatch = (prefs, opt) =>
      prefs?.some((p) => opt.includes(p) || p.includes(opt)) ?? false;

    // Meal type (highest weight)
    if (
      checkMatch(this.foodPreferences[this.selectedFactors.mealType], option)
    ) {
      score += 3;
    }

    // Weather
    if (
      checkMatch(this.foodPreferences[this.selectedFactors.weather], option)
    ) {
      score += 2;
    }

    // Location
    if (
      checkMatch(this.foodPreferences[this.selectedFactors.location], option)
    ) {
      score += 2;
    }

    // Small random bonus
    score += Math.random() * 2;

    return score;
  },

  generateReason(winner, winScore, loseScore) {
    const reasons = [
      `My perfect match for ${this.selectedFactors.mealType}!`,
      `Ideal for ${this.selectedFactors.weather} weather`,
      `Great choice for your current location ${this.selectedFactors.location}`,
      `Scored ${winScore.toFixed(1)} vs ${loseScore.toFixed(1)}`,
      `My algorithm strongly recommends this!`,
      `Listen! This fits your current situation best`,
      `In love with me yet?`,
      `I leaned in your direction didn't i?`,
      `Color me biased, but this is the one! 😂`,
      `I know right, i eat decision making for breakfast 😎`,
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  displayResult(option, reason) {
    const display = this.capitalizeFirstLetter(option);
    let emoji = "🍽️";

    if (option.includes("burger")) emoji = "🍔";
    else if (option.includes("pizza")) emoji = "🍕";
    else if (option.includes("shawarma")) emoji = "🍣";
    else if (option.includes("pasta") || option.includes("tacos")) emoji = "🌮";
    else if (option.includes("salad")) emoji = "🥗";
    else if (option.includes("ice cream")) emoji = "🍨";
    else if (option.includes("coffee") || option.includes("tea")) emoji = "☕";

    document.getElementById(
      "selectedOption"
    ).textContent = `${emoji} ${display}`;
    document.getElementById("decisionReason").textContent = reason;

    const factorsEl = document.getElementById("usedFactors");
    if (factorsEl) {
      factorsEl.innerHTML = `
        <span class="result-factor">${this.getFactorEmoji(
          this.selectedFactors.mealType
        )} ${this.selectedFactors.mealType}</span>
        <span class="result-factor">${this.getFactorEmoji(
          this.selectedFactors.weather
        )} ${this.selectedFactors.weather}</span>
        <span class="result-factor">${this.getFactorEmoji(
          this.selectedFactors.location
        )} ${this.selectedFactors.location}</span>
      `;
    }
  },

  getFactorEmoji(factor) {
    const map = {
      breakfast: "🌅",
      lunch: "☀️",
      dinner: "🌙",
      snack: "🍪",
      hot: "🔥",
      cold: "❄️",
      rainy: "🌧️",
      any: "🌈",
      home: "🏠",
      office: "🏢",
      outdoors: "🌳",
      indoors: "🍣",
    };
    return map[factor] || "✅";
  },

  orderSelectedFood() {
    const selected =
      document.getElementById("selectedOption")?.textContent || "";
    const cleanFood = selected.replace(/^[🍔🍕🍣🌮🥗🍨☕🍽️]+\s*/, "").trim();

    alert(`Search and you shall find ${cleanFood} in our menu...`);
    window.location.href = `calabar.html?search=${encodeURIComponent(
      cleanFood
    )}`;

    this.closeModal();
  },

  resetDecision() {
    this.selectedFactors = { mealType: null, weather: null, location: null };
    this.userOptions = { option1: "", option2: "" };

    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";

    document
      .querySelectorAll(".factor-option")
      .forEach((el) => el.classList.remove("selected"));

    const errorEl = document.getElementById("optionsError");
    if (errorEl) errorEl.style.display = "none";
  },

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  decisionMaker.init();

  // Floating button scroll behavior
  const btn = document.getElementById("decisionMakerBtn");
  if (!btn) return;

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current > lastScroll && current > 100) {
      btn.style.transform = "translateY(100px)";
    } else {
      btn.style.transform = "translateY(0)";
    }
    lastScroll = current;
  });
});
