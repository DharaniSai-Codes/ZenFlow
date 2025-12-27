
# 🛡️ ZenFlow: AI-Powered Focus Engine

ZenFlow is a professional-grade Chrome Extension designed to eliminate digital distractions. It combines high-performance UI components with Google's Gemini AI to coach you through focus relapses.

## 🌟 Features
- **Intelligent Blocking**: Uses Chrome's `declarativeNetRequest` for system-level blocking (impossible to bypass by just closing the app).
- **AI Behavior Coach**: Real-time advice and motivation powered by Gemini 3 Flash.
- **Deep Work Timer**: Integrated Pomodoro timer with progress tracking.
- **Visual Analytics**: Interactive charts showing focus vs. distraction patterns.

## 🛠️ Tech Stack (Industry Standard)
- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) (for type safety and beginner-friendly debugging).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Atomic CSS for ultra-fast UI development).
- **AI Brain**: [@google/genai](https://ai.google.dev/) (Gemini 3 Flash API).
- **Charts**: [Recharts](https://recharts.org/) (D3-based responsive SVG charts).
- **Icons**: [Lucide React](https://lucide.dev/) (Clean, consistent iconography).
- **Browser APIs**: Chrome `storage`, `alarms`, `notifications`, and `declarativeNetRequest`.

## 🚀 How to Install for Free (Anyone can do this)

### 1. Get the Code
- Download the ZIP of this project from GitHub or your source.
- Extract it to a folder on your computer.

### 2. Get your Free AI Key
- Go to [Google AI Studio](https://aistudio.google.com/).
- Click **"Get API Key"**.
- This is 100% free for individual use.

### 3. Build the Extension
*If you are a developer:*
```bash
npm install
npm run build
```
*If you are an end-user:*
- Use the provided `dist` folder.

### 4. Load into Chrome
1. Open Google Chrome and go to `chrome://extensions/`.
2. Turn on **"Developer mode"** (top right toggle).
3. Click **"Load unpacked"** (top left button).
4. Select the folder containing the `manifest.json` file.
5. **ZenFlow** is now active! Pin it to your toolbar.

## 🧠 Workflow Logic (How it works)
1. **The UI (React)**: Captures user intent (e.g., "Block Facebook").
2. **The Storage**: Saves the list to `chrome.storage.local`.
3. **The Service Worker (`background.js`)**: 
   - Listens for storage changes.
   - Automatically generates a "Rule Set" for Chrome's networking engine.
   - Chrome intercepts any request to the blocked site before it even loads, saving bandwidth and your attention.
4. **The AI Coach**: 
   - Sends your "distraction excuse" to Gemini.
   - Receives a structured JSON response with empathy, a strategy, and a quote.

## 📄 License
MIT - Free to use, modify, and distribute by anyone!
