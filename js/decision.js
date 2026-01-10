// Decision Maker Logic
const decisionMaker = {
  // Food preferences database
  foodPreferences: {
    // Meal Type Preferences
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
      "wrap",
      "burger",
      "pasta",
      "rice",
      "noodles",
    ],
    dinner: [
      "steak",
      "chicken",
      "fish",
      "pizza",
      "curry",
      "stir-fry",
      "roast",
      "casserole",
    ],
    snack: [
      "chips",
      "fruit",
      "nuts",
      "cookies",
      "chocolate",
      "yogurt",
      "popcorn",
      "granola",
    ],

    // Weather Preferences
    hot: [
      "salad",
      "smoothie",
      "ice cream",
      "cold sandwich",
      "fruit salad",
      "gazpacho",
      "ceviche",
    ],
    cold: [
      "soup",
      "stew",
      "hot chocolate",
      "roast",
      "casserole",
      "porridge",
      "tea",
      "coffee",
    ],
    rainy: [
      "soup",
      "grilled cheese",
      "mac and cheese",
      "hot chocolate",
      "comfort food",
    ],
    any: ["anything", "surprise me", "chef special"],

    // Location Preferences
    home: ["home cooked", "comfort food", "family style", "experimental"],
    office: ["quick", "neat", "portable", "sandwich", "wrap", "salad"],
    outdoors: ["portable", "finger food", "picnic", "bbq", "grilled"],
    traveling: ["fast food", "snacks", "energy bars", "road trip food"],
  },

  // Decision factors
  selectedFactors: {
    mealType: null,
    weather: null,
    location: null,
  },

  // User options
  userOptions: {
    option1: "",
    option2: "",
  },

  // Initialize
  init() {
    this.bindEvents();
    console.log("Meal Decision Maker initialized");
  },

  // Bind all event listeners
  bindEvents() {
    // Floating button
    document
      .getElementById("decisionMakerBtn")
      .addEventListener("click", () => {
        this.openModal();
      });

    // Close modal
    document
      .getElementById("closeDecisionModal")
      .addEventListener("click", () => {
        this.closeModal();
      });

    // Step 1 buttons
    document.getElementById("nextStep1").addEventListener("click", () => {
      this.collectOptions();
      this.goToStep(2);
    });

    document.getElementById("skipOptions").addEventListener("click", () => {
      this.useRandomOptions();
      this.goToStep(2);
    });

    // Step 2 buttons
    document.getElementById("prevStep2").addEventListener("click", () => {
      this.goToStep(1);
    });

    document.getElementById("nextStep2").addEventListener("click", () => {
      if (this.validateFactors()) {
        this.goToStep(3);
        this.startDecisionProcess();
      }
    });

    // Factor selection
    document.querySelectorAll(".factor-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        this.selectFactor(e.target);
      });
    });

    // Step 3 cancel
    document.getElementById("cancelDecision").addEventListener("click", () => {
      this.goToStep(2);
    });

    // Step 4 buttons
    document.getElementById("restartDecision").addEventListener("click", () => {
      this.resetDecision();
      this.goToStep(1);
    });

    document.getElementById("orderNowBtn").addEventListener("click", () => {
      this.orderSelectedFood();
    });
  },

  // Open modal
  openModal() {
    document.getElementById("decisionModal").classList.add("active");
    this.resetDecision();
  },

  // Close modal
  closeModal() {
    document.getElementById("decisionModal").classList.remove("active");
  },

  // Go to specific step
  goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll(".decision-step").forEach((step) => {
      step.classList.remove("active");
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add("active");
  },

  // Collect user options
  collectOptions() {
    const option1 = document.getElementById("option1").value.trim();
    const option2 = document.getElementById("option2").value.trim();

    if (option1 && option2) {
      this.userOptions.option1 = option1.toLowerCase();
      this.userOptions.option2 = option2.toLowerCase();
    } else {
      this.useRandomOptions();
    }
  },

  // Use random options if user skips
  useRandomOptions() {
    const allOptions = [
      "burger",
      "pizza",
      "pasta",
      "sushi",
      "tacos",
      "salad",
      "sandwich",
      "soup",
      "steak",
      "chicken",
      "fish",
      "curry",
      "ramen",
      "burrito",
      "noodles",
      "rice",
      "stir-fry",
      "wrap",
    ];

    // Pick two random options
    const randomIndex1 = Math.floor(Math.random() * allOptions.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * allOptions.length);
    } while (randomIndex2 === randomIndex1);

    this.userOptions.option1 = allOptions[randomIndex1];
    this.userOptions.option2 = allOptions[randomIndex2];

    // Update input fields
    document.getElementById("option1").value = this.capitalizeFirstLetter(
      this.userOptions.option1
    );
    document.getElementById("option2").value = this.capitalizeFirstLetter(
      this.userOptions.option2
    );
  },

  // Select factor
  selectFactor(element) {
    const factorValue = element.getAttribute("data-factor");
    const category = this.getFactorCategory(factorValue);

    // Remove selected class from all factors in same category
    const allFactors = document.querySelectorAll(`.factor-option[data-factor]`);
    allFactors.forEach((factor) => {
      const factorCat = this.getFactorCategory(
        factor.getAttribute("data-factor")
      );
      if (factorCat === category) {
        factor.classList.remove("selected");
      }
    });

    // Add selected class to clicked factor
    element.classList.add("selected");

    // Store selection
    this.selectedFactors[category] = factorValue;
  },

  // Get factor category
  getFactorCategory(factorValue) {
    if (["breakfast", "lunch", "dinner", "snack"].includes(factorValue)) {
      return "mealType";
    } else if (["hot", "cold", "rainy", "any"].includes(factorValue)) {
      return "weather";
    } else if (
      ["home", "office", "outdoors", "traveling"].includes(factorValue)
    ) {
      return "location";
    }
    return null;
  },

  // Validate factors
  validateFactors() {
    const hasMealType = this.selectedFactors.mealType !== null;
    const hasWeather = this.selectedFactors.weather !== null;
    const hasLocation = this.selectedFactors.location !== null;

    if (!hasMealType || !hasWeather || !hasLocation) {
      alert("Please select one option from each category!");
      return false;
    }
    return true;
  },

  // Start decision process with spinner
  startDecisionProcess() {
    const consideringText = document.getElementById("consideringFactor");
    const factors = [
      "Meal Type",
      "Weather",
      "Location",
      "Your Preferences",
      "Time of Day",
      "Hunger Level",
    ];
    let factorIndex = 0;

    // Animate considering factors
    const factorInterval = setInterval(() => {
      consideringText.textContent = factors[factorIndex];
      factorIndex = (factorIndex + 1) % factors.length;
    }, 800);

    // Make decision after 5 seconds
    setTimeout(() => {
      clearInterval(factorInterval);
      this.makeDecision();
      this.goToStep(4);
    }, 5000);
  },

  // Make the final decision
  makeDecision() {
    // Get options
    const option1 = this.userOptions.option1;
    const option2 = this.userOptions.option2;

    // Score each option based on factors
    const score1 = this.calculateScore(option1);
    const score2 = this.calculateScore(option2);

    // Decide based on scores (with some randomness)
    const randomFactor = Math.random() * 0.3; // Add some randomness
    let selectedOption, reason;

    if (score1 + randomFactor > score2) {
      selectedOption = option1;
      reason = this.generateReason(option1, score1, score2);
    } else {
      selectedOption = option2;
      reason = this.generateReason(option2, score2, score1);
    }

    // Display result
    this.displayResult(selectedOption, reason);
  },

  // Calculate score for an option
  calculateScore(option) {
    let score = 0;

    // Check meal type preference
    const mealPrefs = this.foodPreferences[this.selectedFactors.mealType];
    if (
      mealPrefs &&
      mealPrefs.some((pref) => option.includes(pref) || pref.includes(option))
    ) {
      score += 3;
    }

    // Check weather preference
    const weatherPrefs = this.foodPreferences[this.selectedFactors.weather];
    if (
      weatherPrefs &&
      weatherPrefs.some(
        (pref) => option.includes(pref) || pref.includes(option)
      )
    ) {
      score += 2;
    }

    // Check location preference
    const locationPrefs = this.foodPreferences[this.selectedFactors.location];
    if (
      locationPrefs &&
      locationPrefs.some(
        (pref) => option.includes(pref) || pref.includes(option)
      )
    ) {
      score += 2;
    }

    // Add random factor (0-2 points)
    score += Math.random() * 2;

    return score;
  },

  // Generate reason for selection
  generateReason(selectedOption, winningScore, losingScore) {
    const reasons = [
      `Perfect match for ${this.selectedFactors.mealType}!`,
      `Ideal for ${this.selectedFactors.weather} weather conditions`,
      `Great for when you're ${this.selectedFactors.location}`,
      `This scored ${winningScore.toFixed(1)} vs ${losingScore.toFixed(
        1
      )} on our food compatibility scale`,
      `Based on your preferences, this is the clear winner!`,
      `The algorithm loves this choice for your current situation`,
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  // Display result
  displayResult(selectedOption, reason) {
    // Capitalize first letter
    const displayOption = this.capitalizeFirstLetter(selectedOption);

    // Add emoji based on food type
    let emoji = "🍽️";
    if (selectedOption.includes("burger")) emoji = "🍔";
    else if (selectedOption.includes("pizza")) emoji = "🍕";
    else if (selectedOption.includes("sushi")) emoji = "🍣";
    else if (selectedOption.includes("taco")) emoji = "🌮";
    else if (selectedOption.includes("salad")) emoji = "🥗";
    else if (selectedOption.includes("ice cream")) emoji = "🍨";
    else if (
      selectedOption.includes("coffee") ||
      selectedOption.includes("tea")
    )
      emoji = "☕";

    // Update display
    document.getElementById(
      "selectedOption"
    ).textContent = `${emoji} ${displayOption}`;
    document.getElementById("decisionReason").textContent = reason;

    // Show used factors
    const usedFactors = document.getElementById("usedFactors");
    usedFactors.innerHTML = `
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
  },

  // Get emoji for factor
  getFactorEmoji(factor) {
    const emojiMap = {
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
      traveling: "🚗",
    };
    return emojiMap[factor] || "✅";
  },

  // Order selected food
  orderSelectedFood() {
    const selectedOption =
      document.getElementById("selectedOption").textContent;
    alert(`Search ${selectedOption}... from our bogus menu!`);
    window.location.href = `calabar.html?search=${encodeURIComponent(
      selectedOption
    )}`;
    // In a real implementation, this would search for restaurants offering the selected food
    this.closeModal();

    // You could add:
    // window.location.href = `restaurants.html?search=${encodeURIComponent(selectedOption)}`;
  },

  // Reset decision
  resetDecision() {
    this.selectedFactors = {
      mealType: null,
      weather: null,
      location: null,
    };

    this.userOptions = {
      option1: "",
      option2: "",
    };

    // Clear inputs
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";

    // Clear selections
    document.querySelectorAll(".factor-option").forEach((option) => {
      option.classList.remove("selected");
    });
  },

  // Helper: Capitalize first letter
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  decisionMaker.init();

  // Make floating button follow scroll
  const floatingBtn = document.getElementById("decisionMakerBtn");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Hide button when scrolling down, show when scrolling up
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      floatingBtn.style.transform = "translateY(100px)";
    } else {
      // Scrolling up or at top
      floatingBtn.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });
});
