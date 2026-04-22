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

```
tabsense/
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
```
---

## Roadmap

- [x] v0.1 — Core time tracking and bookmark prompt
- [ ] v0.2 — Auto-save toggle (save silently without banner)
- [ ] v0.3 — Firefox support
- [ ] v0.4 — Smart folder organisation
- [ ] v0.5 — Search across saved bookmarks
- [ ] v0.6 — Pause/Resume watching toggle
- [ ] v0.7 — Per-site settings (ignore certain domains)
- [ ] v0.8 — Safari + iOS support
- [ ] v1.0 — Chrome Web Store launch

---

## Built With

- Vanilla JavaScript (no frameworks — intentional)
- Chrome Extensions Manifest V3
- Chrome APIs — tabs, bookmarks, storage, notifications

---

## Contributing

This is an open source project — contributions are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-idea`)
3. Commit your changes
4. Open a Pull Request

---

## Author

**Harish Sundaram**
Built in public — follow the journey on
[LinkedIn](https://linkedin.com/in/harishsundaramuk)
and [GitHub](https://github.com/harishsundaramuk)

---

## License

MIT — free to use, modify and distribute.