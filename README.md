# TabSense 🔖

> A smart browser extension that watches how long you spend on a page and asks if you want to bookmark it — before you forget it forever.

![Version](https://img.shields.io/badge/version-0.1.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## The Problem

You stumble on a great article, tool, or resource. You think
"I'll save this later." You never do. It's gone forever.

Browser bookmarks are manual, messy, and forgotten.

## The Solution

TabSense watches how long you spend on a page. When you cross
your chosen time threshold, it gently asks — *"Want to save this?"*
One click. Bookmarked. Organised. Searchable.

---

## Features

- ⏱ **Time-based prompting** — set your own threshold (1–60 mins)
- 🔖 **One-click bookmarking** — saves to Chrome bookmarks instantly
- 🎨 **Clean minimal UI** — dark luxury popup design
- 🔍 **Recently saved** — quick access to your last 3 bookmarks
- 🔒 **100% local** — no data leaves your browser, ever
- 🌐 **Cross-browser** — Chrome and Edge (Firefox and Safari coming)

---

## Installation (Developer Mode)

1. Clone this repo
```bash
   git clone https://github.com/harishsundaramuk/TabSense.git
```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer Mode** (top right toggle)

4. Click **Load Unpacked** and select the `src/` folder

5. Pin TabSense from the extensions menu 📌

---

## Project Structure

absense/
├── src/
│   ├── manifest.json        # Extension config and permissions
│   ├── background/
│   │   └── background.js    # Service worker — time tracking brain
│   ├── content/
│   │   └── content.js       # Runs inside webpages
│   ├── popup/
│   │   ├── popup.html       # Extension popup UI
│   │   ├── popup.css        # Dark luxury styles
│   │   └── popup.js         # Popup interaction logic
│   └── icons/               # Extension icons (16, 48, 128px)
├── docs/
│   ├── architecture.md      # How all pieces connect
│   └── concepts.md          # Deep dives on key concepts
├── NOTES.md                 # Learning journal
├── CHANGELOG.md             # Version history
└── README.md                # You are here