/**
 * background.js - The Brain of TabSense
 * 
 * This is a Service Worker - it runs silently in the background
 * even when the user is not looking at the extension.
 * 
 * CONCEPT: Service Workers
 * Think of this like a security guard who watches all your tabs
 * 24/7 without you seeing them. They wake up when something
 * happens (like a tab change) and go back to sleep when idle.
 * This saves battery and memory.
 * 
 * CONCEPT: Event Driven Programming
 * Nothing in this file runs automatically top to bottom.
 * Instead, we LISTEN for events and REACT to them.
 * Example: "when a tab becomes active, start the timer"
 */

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * TIME_THRESHOLD_MINUTES
 * How many minutes before we ask the user to bookmark a page.
 * Stored here so it is easy to change in one place.
 * Later we will let the user change this themselves.
 * 
 * CONCEPT: Constants
 * We use const because this value should never be reassigned.
 * Naming it in UPPER_CASE is a convention that tells other
 * developers "this is a configuration value, not a variable"
 */
const TIME_THRESHOLD_MINUTES = 5;

/**
 * activeTabTimer
 * Stores the timer ID for the currently active tab.
 * We need to store this so we can CANCEL the timer if the
 * user switches to a different tab before time is up.
 * 
 * CONCEPT: Why null?
 * null means "this variable exists but has no value yet"
 * It is different from undefined (variable does not exist)
 * or 0 (variable exists and equals zero)
 */
let activeTabTimer = null;

/**
 * activeTabUrl
 * Stores the URL of the currently active tab.
 * We use this to check if the user is still on the same
 * page when the timer fires.
 */
let activeTabUrl = null;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * clearActiveTimer
 * Cancels the current timer if one is running.
 * 
 * CONCEPT: clearTimeout
 * setTimeout returns an ID number when you create a timer.
 * clearTimeout(id) cancels that timer before it fires.
 * If we don't cancel old timers, they will all fire at once
 * causing multiple bookmark prompts for the same page - a bug!
 * 
 * @returns {void}
 */
function clearActiveTimer() {
  if (activeTabTimer !== null) {
    // Cancel the timer using its ID
    clearTimeout(activeTabTimer);

    // Reset back to null so we know no timer is running
    activeTabTimer = null;
  }
}

/**
 * startTimer
 * Starts a countdown for the given URL.
 * When the countdown ends, it asks the user to bookmark the page.
 * 
 * CONCEPT: setTimeout
 * setTimeout(function, milliseconds) runs a function ONCE
 * after a delay. It does NOT repeat - think of it like
 * an alarm clock, not a ticking clock.
 * 
 * CONCEPT: Why milliseconds?
 * JavaScript timers always work in milliseconds.
 * 1 second = 1000ms
 * 1 minute = 60 x 1000 = 60,000ms
 * 5 minutes = 5 x 60 x 1000 = 300,000ms
 * 
 * @param {string} url - The page URL to track
 * @param {string} title - The page title to show in the prompt
 * @returns {void}
 */
function startTimer(url, title) {
  // Always clear any existing timer before starting a new one
  // This prevents multiple timers running at the same time
  clearActiveTimer();

  // Store the URL so we can reference it when the timer fires
  activeTabUrl = url;

  // Convert minutes to milliseconds for setTimeout
  // e.g. 5 minutes = 5 * 60 * 1000 = 300,000ms
  const thresholdMs = TIME_THRESHOLD_MINUTES * 60 * 1000;

  /**
   * setTimeout returns a timer ID number.
   * We store it in activeTabTimer so we can cancel it later
   * if the user switches tabs before the time is up.
   * 
   * CONCEPT: Arrow Functions
   * () => { } is an arrow function - a modern shorter way
   * to write function() { }
   * We use it here because we don't need a named function
   * for this one-time callback
   */
  activeTabTimer = setTimeout(() => {
    promptUser(url, title);
  }, thresholdMs);

  console.log(`TabSense: Timer started for ${url} (${TIME_THRESHOLD_MINUTES} mins)`);
}

/**
 * promptUser
 * Shows a notification asking the user to bookmark the page.
 * 
 * CONCEPT: chrome.notifications API
 * This is a Chrome-specific API that shows a native OS
 * notification - the same kind you see from other apps.
 * It only works in extensions, not normal webpages.
 * 
 * @param {string} url - The page URL to potentially bookmark
 * @param {string} title - The page title to show in notification
 * @returns {void}
 */
function promptUser(url, title) {
  chrome.notifications.create({
    type: "basic",
    // We will add a real icon later
    iconUrl: "../icons/icon48.png",
    title: "Save this page?",
    message: `You've been on "${title}" for ${TIME_THRESHOLD_MINUTES} minutes. Want to bookmark it?`,
    buttons: [
      { title: "Yes, bookmark it" },
      { title: "No thanks" }
    ],
    requireInteraction: true
  });

  console.log(`TabSense: Prompted user for ${url}`);
}

// ============================================================
// EVENT LISTENERS
// ============================================================

/**
 * chrome.tabs.onActivated
 * Fires whenever the user switches to a different tab.
 * 
 * CONCEPT: Event Listeners
 * .addListener() says "whenever THIS event happens, run THIS function"
 * We never call these functions ourselves - Chrome calls them
 * automatically when the event occurs.
 * 
 * CONCEPT: activeInfo object
 * Chrome passes us an object with info about what changed.
 * activeInfo.tabId = the ID number of the newly active tab
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Get full details about the newly active tab
  // using its ID number
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    /**
     * CONCEPT: Callbacks
     * chrome.tabs.get() is asynchronous - it doesn't return
     * the result immediately. Instead, it calls our function
     * (the callback) when the data is ready.
     * This is why we write the code inside (tab) => { }
     * rather than: const tab = chrome.tabs.get(tabId)
     */

    // Only track real web pages, not Chrome internal pages
    // chrome:// pages and new tab pages don't need bookmarking
    if (tab.url && tab.url.startsWith("http")) {
      startTimer(tab.url, tab.title);
    } else {
      // If it's not a real webpage, clear any running timer
      clearActiveTimer();
    }
  });
});

/**
 * chrome.tabs.onUpdated
 * Fires whenever a tab changes - including when a new page
 * loads in the current tab (user navigates to a new URL).
 * 
 * @param {number} tabId - ID of the tab that changed
 * @param {object} changeInfo - What changed about the tab
 * @param {object} tab - Full details of the tab
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  /**
   * changeInfo.status === "complete" means the page has
   * fully loaded. We wait for this before starting the timer
   * because we want the full page title, not a loading state.
   * 
   * tab.active means this is the tab the user is currently on.
   * We don't want to track tabs loading in the background.
   */
  if (changeInfo.status === "complete" && tab.active) {
    if (tab.url && tab.url.startsWith("http")) {
      startTimer(tab.url, tab.title);
    }
  }
});

/**
 * chrome.tabs.onRemoved
 * Fires when a tab is closed.
 * We clear the timer so we don't prompt for a closed tab.
 */
chrome.tabs.onRemoved.addListener(() => {
  clearActiveTimer();
});

console.log("TabSense: Background service worker started");