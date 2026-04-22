/**
 * welcome.js — Onboarding Page Logic
 * 
 * CONCEPT: This page is a normal webpage (not a popup)
 * It runs in a full Chrome tab, so it has access to
 * the full window, document, and chrome extension APIs.
 * 
 * Its only job:
 * 1. Let user set their threshold
 * 2. Save it to chrome.storage
 * 3. Close and let them start using the extension
 */

const decreaseBtn    = document.getElementById("decreaseBtn");
const increaseBtn    = document.getElementById("increaseBtn");
const thresholdNum   = document.getElementById("thresholdNum");
const ctaBtn         = document.getElementById("ctaBtn");

// Start at 5 minutes default
let threshold = 5;

/**
 * updateDisplay
 * Updates the number shown on screen.
 * Simple but important — always keep UI in sync with data.
 */
function updateDisplay() {
  thresholdNum.textContent = threshold;
}

// Decrease — minimum 1 minute
decreaseBtn.addEventListener("click", () => {
  threshold = Math.max(1, threshold - 1);
  updateDisplay();
});

// Increase — maximum 60 minutes
increaseBtn.addEventListener("click", () => {
  threshold = Math.min(60, threshold + 1);
  updateDisplay();
});

/**
 * CTA button — save threshold and close page
 * 
 * CONCEPT: chrome.storage.sync
 * Saves the threshold so background.js can read it.
 * This is how the onboarding page "talks" to the extension.
 */
ctaBtn.addEventListener("click", async () => {
  // Save threshold to storage
  await chrome.storage.sync.set({ threshold });

  // Visual feedback before closing
  ctaBtn.textContent = "You're all set! ✓";
  ctaBtn.style.background = "#4caf7d";

  // Close this tab after a short delay
  setTimeout(() => {
    window.close();
  }, 1000);
});

// Load saved threshold if user comes back to this page
async function init() {
  const data = await chrome.storage.sync.get("threshold");
  if (data.threshold) {
    threshold = data.threshold;
    updateDisplay();
  }
}

init();