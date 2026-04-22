/**
 * popup.js — TabSense Popup Logic
 * 
 * CONCEPT: Popup Scripts
 * This file runs ONLY when the user clicks the extension icon.
 * It is destroyed when the popup closes.
 * This is different from background.js which runs continuously.
 * 
 * CONCEPT: DOM Manipulation
 * document.getElementById() finds an HTML element by its id.
 * Once we have the element, we can read or change its content.
 * This is how JavaScript makes pages dynamic and interactive.
 */

// ============================================================
// GET REFERENCES TO HTML ELEMENTS
// ============================================================

/**
 * We grab all the elements we need to update at the top.
 * This is more efficient than searching for them repeatedly.
 * 
 * CONCEPT: const for DOM references
 * The variable itself won't change (always points to same element)
 * but the element's content CAN change. So const is correct here.
 */
const pageTitle    = document.getElementById("pageTitle");
const timerBar     = document.getElementById("timerBar");
const timerText    = document.getElementById("timerText");
const thresholdVal = document.getElementById("thresholdValue");
const decreaseBtn  = document.getElementById("decreaseBtn");
const increaseBtn  = document.getElementById("increaseBtn");
const recentsList  = document.getElementById("recentsList");

// ============================================================
// THRESHOLD CONTROLS
// ============================================================

/**
 * loadThreshold
 * Reads the saved threshold from Chrome storage and displays it.
 * 
 * CONCEPT: chrome.storage.sync
 * Unlike localStorage (tied to one webpage), chrome.storage.sync
 * is shared across your entire extension AND syncs across
 * devices if the user is logged into Chrome.
 * 
 * CONCEPT: Async/Await
 * Storage operations take time - we must wait for them.
 * async/await lets us write asynchronous code that READS
 * like normal synchronous code, top to bottom.
 */
async function loadThreshold() {
  // chrome.storage.sync.get returns a Promise
  // await pauses here until the data is ready
  const data = await chrome.storage.sync.get("threshold");

  /**
   * data.threshold might be undefined if never saved before.
   * The || 5 is a fallback — "use threshold if it exists, else use 5"
   * 
   * CONCEPT: Nullish/OR fallback
   * undefined || 5 evaluates to 5
   * 3 || 5 evaluates to 3 (because 3 is truthy)
   */
  const threshold = data.threshold || 3;
  thresholdVal.textContent = `${threshold} min`;
  return threshold;
}

/**
 * saveThreshold
 * Saves the new threshold to Chrome storage.
 * 
 * @param {number} value - The new threshold in minutes
 */
async function saveThreshold(value) {
  await chrome.storage.sync.set({ threshold: value });
  thresholdVal.textContent = `${value} min`;
}

// Decrease button — minimum 1 minute
decreaseBtn.addEventListener("click", async () => {
  const data = await chrome.storage.sync.get("threshold");
  const current = data.threshold || 5;

  // Math.max ensures we never go below 1
  const newValue = Math.max(1, current - 1);
  await saveThreshold(newValue);
});

// Increase button — maximum 60 minutes
increaseBtn.addEventListener("click", async () => {
  const data = await chrome.storage.sync.get("threshold");
  const current = data.threshold || 5;

  // Math.min ensures we never go above 60
  const newValue = Math.min(60, current + 1);
  await saveThreshold(newValue);
});

// ============================================================
// CURRENT PAGE INFO
// ============================================================

/**
 * loadCurrentTab
 * Gets info about the tab the user is currently on
 * and displays it in the popup.
 * 
 * CONCEPT: chrome.tabs.query
 * We can query for tabs matching certain criteria.
 * { active: true, currentWindow: true } means
 * "the tab currently in focus in this browser window"
 */
async function loadCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  /**
   * CONCEPT: Array Destructuring
   * chrome.tabs.query returns an ARRAY of tabs.
   * const [tab] = array means "take the first item"
   * It's shorthand for: const tab = result[0]
   */

  if (tab && tab.title) {
    pageTitle.textContent = tab.title;
  } else {
    pageTitle.textContent = "Unknown page";
  }
}

// ============================================================
// RECENTLY SAVED BOOKMARKS
// ============================================================

/**
 * loadRecentBookmarks
 * Gets the last 3 bookmarks saved by TabSense and shows them.
 * 
 * CONCEPT: chrome.storage for custom data
 * We store our own bookmarks list separately from
 * the browser's built-in bookmarks, so we can easily
 * retrieve just the ones TabSense saved.
 */
async function loadRecentBookmarks() {
  const data = await chrome.storage.sync.get("savedBookmarks");
  const bookmarks = data.savedBookmarks || [];

  if (bookmarks.length === 0) {
    // Keep the empty state message
    return;
  }

  // Clear the empty state
  recentsList.innerHTML = "";

  /**
   * .slice(-3) gets the last 3 items from the array.
   * .reverse() shows newest first.
   * 
   * CONCEPT: Array methods
   * Arrays have built-in methods for manipulating data.
   * slice, reverse, map, filter are the most important ones.
   */
  bookmarks.slice(-3).reverse().forEach((bookmark) => {
    const li = document.createElement("li");
    li.textContent = bookmark.title || bookmark.url;

    // Clicking a recent bookmark opens it in a new tab
    li.addEventListener("click", () => {
      chrome.tabs.create({ url: bookmark.url });
    });

    recentsList.appendChild(li);
  });
}

// ============================================================
// INITIALISE
// ============================================================

/**
 * init
 * Runs all our load functions when the popup opens.
 * 
 * CONCEPT: Async parallel execution
 * Promise.all runs multiple async functions AT THE SAME TIME
 * instead of one after another.
 * This makes the popup load faster.
 */
async function init() {
  await Promise.all([
    loadThreshold(),
    loadCurrentTab(),
    loadRecentBookmarks()
  ]);
}

// Run init immediately when popup opens
init();