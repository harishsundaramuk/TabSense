# TabSense - Learning Notes

## What is manifest.json?
Every Chrome extension MUST have a manifest.json file.
It is the identity card of your extension. The browser reads 
this file first to understand:
- What is this extension called?
- What permissions does it need?
- Which files handle which jobs?

## manifest_version: 3
This tells Chrome we are using the latest standard (V3).
Always use 3 for new extensions. V2 is being phased out.

## permissions explained
- tabs: lets us see which tab is open and track time on it
- bookmarks: lets us save bookmarks on behalf of the user
- storage: lets us save settings like the time threshold
- notifications: lets us show the "bookmark this?" prompt

## background (service_worker)
This is the brain of the extension.
Runs silently in the background even when you are not 
looking at the extension.
Think of it like a security guard watching all your tabs.

## content_scripts
These run inside the actual webpage the user is visiting.
They can read and interact with the page content.
"matches": ["<all_urls>"] means it runs on every website.

## action (popup)
This is what appears when the user clicks the extension icon.
It is just an HTML file like any normal webpage.

## What is a Service Worker? (background.js)
A service worker is a script that runs in the background
separately from a web page. It can't access the DOM (the
visible page) but it CAN listen to browser events like
tab switches, page loads, and closures.

## Event Driven vs Sequential Programming
Normal scripts run top to bottom, line by line.
Event driven code says "when X happens, do Y".
Our entire background.js works this way - nothing runs
until Chrome fires an event.

## Callbacks vs Regular Functions
A callback is a function you pass INTO another function
to be called later. Example:
chrome.tabs.get(tabId, (tab) => {
  // This runs AFTER Chrome fetches the tab info
  // Not immediately when chrome.tabs.get is called
})
This is because fetching tab info takes time (async).

## setTimeout vs setInterval
setTimeout  → runs ONCE after a delay (alarm clock)
setInterval → runs REPEATEDLY on a schedule (ticking clock)
We use setTimeout because we only need to prompt ONCE
when the threshold is crossed, not repeatedly.

## popup.js vs background.js — Key Difference
background.js: always running, watching, no UI access
popup.js: only runs when user clicks the icon, has UI access
They communicate through chrome.storage (shared data store)

## DOM Manipulation
The browser turns HTML into a tree of objects called the DOM.
document.getElementById("name") finds an element by its id=""
.textContent changes the visible text inside an element
.addEventListener("click", fn) runs fn when user clicks it

## Promise.all
Running async functions one by one:  3 seconds total
Running them with Promise.all:       1 second total  
Use it whenever tasks don't depend on each other.

## try/catch — Defensive Programming
If code can fail (network, storage, permissions) wrap it in try/catch.
try   { } — the code we want to run
catch { } — what to do if it fails
Without this one error silently crashes the whole background script.

## Spread Operator (...)
const a = [1, 2, 3]
const b = [...a, 4]  →  [1, 2, 3, 4]
Creates a new array instead of modifying the original.
Always prefer this when working with stored data.

## buttonIndex in Notifications
Chrome passes a number telling us WHICH button was clicked.
0 = first button ("Yes, bookmark it")
1 = second button ("No thanks")
This is zero-indexed — just like arrays in JavaScript.