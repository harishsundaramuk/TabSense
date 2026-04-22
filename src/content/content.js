/**
 * content.js — TabSense Content Script
 * 
 * CONCEPT: Content Scripts
 * This file runs INSIDE the actual webpage the user is visiting.
 * It can see and modify the page's HTML and CSS.
 * It CANNOT directly call chrome.bookmarks or chrome.storage —
 * those are only available in background scripts.
 * 
 * CONCEPT: Message Passing
 * Content scripts and background scripts live in separate worlds.
 * They communicate by sending messages to each other.
 * Think of it like texting between two people.
 * 
 * background.js → sends message "show banner"
 * content.js    → receives it and shows the banner
 * content.js    → sends message "user clicked yes"
 * background.js → receives it and saves the bookmark
 */

// ============================================================
// BANNER STYLES
// ============================================================

/**
 * injectStyles
 * Adds our banner CSS directly into the webpage.
 * We do this in JS because content scripts can't load
 * external CSS files into the page directly.
 */
function injectStyles() {
  if (document.getElementById("tabsense-styles")) return;

  const style = document.createElement("style");
  style.id = "tabsense-styles";
  style.textContent = `
    #tabsense-banner {
      position: fixed;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: #17171a;
      border: 1px solid #2a2a2e;
      border-radius: 14px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      font-family: -apple-system, 'DM Sans', sans-serif;
      min-width: 340px;
      max-width: 480px;
      transition: top 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #tabsense-banner.visible {
      top: 20px;
    }

    #tabsense-banner-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    #tabsense-banner-text {
      flex: 1;
    }

    #tabsense-banner-title {
      font-size: 13px;
      font-weight: 500;
      color: #f0ece4;
      margin-bottom: 2px;
    }

    #tabsense-banner-sub {
      font-size: 12px;
      color: #7a7875;
    }

    #tabsense-banner-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .tabsense-btn {
      border: none;
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      font-family: inherit;
    }

    .tabsense-btn:active {
      transform: scale(0.95);
    }

    .tabsense-btn-yes {
      background: #E8650A;
      color: white;
    }

    .tabsense-btn-yes:hover {
      opacity: 0.85;
    }

    .tabsense-btn-no {
      background: #2a2a2e;
      color: #f0ece4;
    }

    .tabsense-btn-no:hover {
      background: #333338;
      color: #ffffff;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// BANNER UI
// ============================================================

/**
 * showBanner
 * Creates and animates the bookmark prompt banner.
 * 
 * @param {string} title - Page title to show in the banner
 * @param {number} minutes - How long user spent on page
 */
function showBanner(title, minutes) {
  injectStyles();

  const existing = document.getElementById("tabsense-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "tabsense-banner";

  banner.innerHTML = `
    <img 
      id="tabsense-banner-icon"
      src="${chrome.runtime.getURL("icons/icon48.png")}" 
      alt="TabSense"
    />
    <div id="tabsense-banner-text">
      <div id="tabsense-banner-title">Want to save this page?</div>
      <div id="tabsense-banner-sub">
        You've spent ${minutes} min on "${title}"
      </div>
    </div>
    <div id="tabsense-banner-actions">
      <button class="tabsense-btn tabsense-btn-yes" id="tabsense-yes">
        Save it
      </button>
      <button class="tabsense-btn tabsense-btn-no" id="tabsense-no">
        Dismiss
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add("visible");
    });
  });

  document.getElementById("tabsense-yes").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "SAVE_BOOKMARK" });
    hideBanner();
  });

  document.getElementById("tabsense-no").addEventListener("click", (e) => {
    e.stopPropagation();
    hideBanner();
  });

  // Don't auto-dismiss — let user decide
  // Banner stays until user clicks Save or Dismiss
}

/**
 * hideBanner
 * Slides the banner back up and removes it from the page.
 */
function hideBanner() {
  const banner = document.getElementById("tabsense-banner");
  if (!banner) return;
  banner.classList.remove("visible");
  setTimeout(() => banner.remove(), 500);
}

// ============================================================
// MESSAGE LISTENER
// ============================================================

/**
 * chrome.runtime.onMessage
 * Listens for messages from background.js
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_BANNER") {
    showBanner(message.title, message.minutes);
    sendResponse({ status: "ok" });
  }
  return true;
});

console.log("TabSense: Content script loaded ✅");

