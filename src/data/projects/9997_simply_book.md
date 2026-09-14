---
title: "Simply Book"
tagline: "A free, fully client-side EPUB reader with text-to-speech, highlights, and notes"
iconEmoji: '📖'
status: "Completed"
technologies: ["React", "Typescript", "Vite", "foliate-js"]
role: "Lead Developer"
github_url: "https://github.com/KabirSinghMehrok/simply-books"
live_url: "https://simply-books.vercel.app/"
project_image: "simply-book.png"
---

### Overview
Simply Book is a free EPUB reader that runs entirely in the browser — no backend, no accounts, no per-user cost. Books are stored locally via IndexedDB and rendering, text-to-speech, and highlighting all happen client-side.

### Key Features
- **Reading Experience:** Keyboard, click-zone, and swipe navigation with a table of contents panel and 4 reading themes (Paper/Ink/Dusk/Slate).
- **Text-to-Speech:** Reads sentence by sentence with live highlighting and auto page-turn, using either the browser's built-in voices or an opt-in natural voice (Piper) that runs in a Web Worker.
- **Highlights & Notes:** Select text for a color/note toolbar, with a dedicated panel listing every highlight in reading order.
- **In-Book Search:** A search bar with live match count, next/previous navigation, and case-sensitivity toggle.

### Technical Details & Learning
- **Tech Stack:** Built with React and TypeScript on Vite, using foliate-js for EPUB rendering and IndexedDB (via `idb`) for local storage.
- **Offline TTS:** Integrated Piper (via `@mintplex-labs/piper-tts-web`) as a downloadable natural-voice TTS engine running off the main thread, with automatic fallback to the system voice while it downloads.
