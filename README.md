# 📡 MarketRadar

> **Real-time market intelligence, anomaly detection, and capital flow analytics powered by the CoinMarketCap API.**  
> *Submitted to the **CoinMarketCap Hackathon** (November 2026).*

[![CoinMarketCap API](https://img.shields.io/badge/Powered%20By-CoinMarketCap%20API-3861FB?style=flat&logo=coinmarketcap&logoColor=white)](https://coinmarketcap.com/api/)
[![Hackathon Track](https://img.shields.io/badge/Track-Markets%20%26%20Trading%20Tools-blueviolet?style=flat)](#hackathon-track--scoring-alignment)
[![Deployment](https://img.shields.io/badge/Deployment-Web%20%26%20Extension-10b981?style=flat)](#dual-deployment-modes)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

---

## 🧭 Overview

**MarketRadar** is an institutional-grade crypto anomaly scanner and momentum intelligence terminal built for the **CoinMarketCap Hackathon** under the **Markets and Trading Tools** track.

Traditional market screeners only highlight standard percentage gainers, which are often lagging indicators after a price breakout has already occurred. MarketRadar inverts this paradigm: it mathematically identifies **stealth accumulation**, **liquidity surges**, and **momentum divergence** across crypto assets before major breakouts or selloffs materialize.

Equipped with a live **Per-Signal Streaming Engine**, **API Telemetry Tracker**, and **Dual-Mode Deployment (Web + Chrome Extension Side Panel)**, MarketRadar delivers actionable trading intelligence directly to traders.

---

## ⚡ Core Features & Use Cases

### 1. Anomaly Detection Engine (`anomalyDetector.ts`)
MarketRadar processes real-time CoinMarketCap quotes and listing metrics to score assets on a **0–100 Anomaly Index**:
* **Accumulation (`ACCUMULATION`)**: Flags assets experiencing rapid 24h volume surges (+70% to +200%) while price movement remains compressed (<4%), indicating institutional absorption.
* **Momentum Breakouts (`BREAKOUT`)**: Identifies sharp 1-hour velocity spikes diverging significantly from 24-hour baseline trends.
* **Liquidity Concentration (`LIQUIDITY_SURGE`)**: Detects abnormal daily volume-to-market-cap turnover ratios (>35%), pinpointing sudden liquidity migration.
* **Price & Beta Divergence (`DIVERGENCE`)**: Highlights aggressive outliers exhibiting unusual volatility relative to broader market beta.

### 2. Live "Per-Signal" Continuous Radar Stream (`signalStreamer.ts`)
* **Continuous Sweep**: Every 8 seconds, the background radar sweeps the token universe to identify micro-anomalies and momentum shifts.
* **Incremental Slide-In Feed**: Real-time signal cards animate into the top of the feed with dynamic relative timestamps ("Just now", "14s ago") and anomaly badges.
* **Cumulative Signal Counter**: Displays the exact number of active signals detected across the session in real time.

### 3. Anomaly Radar Screener Table (`RadarScanner.tsx`)
* **Multi-Metric Sorting**: Instantly sort by Anomaly Score, Current Price, 1h Velocity, 24h Change, or Trading Volume.
* **Instant Filtering & Search**: Filter by blockchain sector/category (Layer 1, DeFi, AI & DePIN, Layer 2, Real World Assets) and search by token symbol or name.
* **Dynamic Score Meters**: Visual, color-coded health meters (green $\rightarrow$ blue $\rightarrow$ amber $\rightarrow$ red) representing outlier severity.

### 4. Deep-Dive Asset Drawer (`TokenModal.tsx`)
* Clicking any asset in the screener or signal feed opens a detailed inspection modal.
* Displays 24h volume turnover ratio, 1h momentum, circulating market cap, anomaly diagnosis, and direct links to official CoinMarketCap currency pages.

### 5. API Telemetry & Rate-Limit Shield (`ApiUsageCard.tsx`)
* **Session Call Counter**: Tracks live API requests made during the user's active session.
* **Daily Credit Quota Bar**: Displays credit consumption against CoinMarketCap's standard daily tier allowance (333 credits/day).
* **Latency Counter**: Real-time round-trip latency indicator (e.g. `145ms`).
* **Zero-Fail Fallback Mode**: If an API key is absent, rate-limited, or blocked by browser CORS restrictions, MarketRadar transitions seamlessly to a snapshot dataset—ensuring judges and users experience zero downtime.

---

## 🎨 Design & Hardware Aesthetic

* **Perforated Matrix Texture**: Inspired by classic radar hardware instrumentation, MarketRadar features a precision pore-distribution matrix (`radial-gradient` dot matrix on a 22px grid) across cards, scanner tables, and sidebars.
* **Pure CSS Architecture**: Built entirely with modular, custom CSS inside `src/Styles/` without third-party utility frameworks.
* **Scoped Class Isolation**: Every style file uses strict class prefixing (`NavBar_`, `MetricCards_`, `RadarScanner_`, `AnomalyFeed_`, `ApiUsage_`, `TokenModal_`, `Dashboard_`, `LandingPage_`) to guarantee zero style entanglement.
* **Fully Responsive**: Adapts fluidly across 4K displays, laptop screens, tablets, and compact mobile browsers.

---

## 🔌 Dual Deployment Modes

MarketRadar is engineered from the ground up to operate in two distinct environments:

### 1. Web Application Mode (GitHub Pages)
* Configured with React Router `HashRouter` to prevent 404 errors on static hosts.
* **Live Web App**: [https://rocker-bell.github.io/MarketRadar](https://rocker-bell.github.io/MarketRadar)
* **Build Command**:
  ```bash
  npm run build
  npm run deploy
  ```

### 2. Chrome Extension Side Panel Mode
MarketRadar can run as an ambient side panel inside Google Chrome, allowing traders to monitor market anomalies alongside their decentralized exchanges (Uniswap, Raydium) or trading terminals:
* **Manifest V3 Architecture**: Powered by [`public/manifest.json`](public/manifest.json) using the modern `side_panel` permission.
* **Extension Build Script**:
  ```bash
  npm run build:extension
  ```
  *(This compiles Vite with `base: './'` so all script and style paths resolve locally inside Chrome).*
* **How to Load in Chrome**:
  1. Run `npm run build:extension`.
  2. Open Chrome and navigate to `chrome://extensions/`.
  3. Enable **Developer mode** (top right toggle).
  4. Click **Load unpacked** and select the generated `dist/` directory.
  5. Click the MarketRadar extension icon to pin it to your Chrome Side Panel!

---

## 📁 Project Directory Structure

```text
MarketRadar/
├── public/
│   ├── manifest.json            # Chrome Extension Manifest V3 configuration
│   ├── background.js            # Extension service worker
│   └── favicon.svg              # Radar application icon
├── src/
│   ├── Components/              # Modular UI Components
│   │   ├── NavBar.tsx           # Navigation bar with live status pill
│   │   ├── MetricCards.tsx      # Top 5-metric summary row
│   │   ├── RadarScanner.tsx     # Filterable anomaly screener table
│   │   ├── AnomalyFeed.tsx      # Live streaming "per-signal" alert feed
│   │   ├── ApiUsageCard.tsx     # CMC API telemetry & quota widget
│   │   ├── TokenModal.tsx       # Detailed asset inspector modal
│   │   └── Landing_page.tsx     # Project landing page & CTA
│   ├── dashboard/
│   │   └── Dashboard.tsx        # Master dashboard orchestrator
│   ├── Styles/                  # Pure CSS stylesheets with unique prefixes
│   │   ├── NavBar.css           # NavBar_ classes
│   │   ├── MetricCards.css      # MetricCards_ classes
│   │   ├── RadarScanner.css     # RadarScanner_ classes
│   │   ├── AnomalyFeed.css      # AnomalyFeed_ classes
│   │   ├── ApiUsageCard.css     # ApiUsage_ classes
│   │   ├── TokenModal.css       # TokenModal_ classes
│   │   ├── Dashboard.css        # Dashboard_ classes
│   │   └── LandingPage.css      # LandingPage_ classes
│   ├── utilities/               # Core business & algorithmic logic
│   │   ├── anomalyDetector.ts   # Accumulation & breakout scoring algorithms
│   │   ├── cmcApi.ts            # CoinMarketCap API client & cached snapshot
│   │   ├── signalStreamer.ts    # 8-second live signal stream generator & API telemetry
│   │   └── formatters.ts        # Currency, percent, and number formatters
│   ├── App.tsx                  # App root with HashRouter routes
│   ├── main.tsx                 # React 19 root bootstrap
│   └── index.css                # Foundational layout container
├── .env                         # Environment variables (CMC_VITE_API)
├── vite.config.ts               # Vite dual-mode build configuration (web vs extension)
└── package.json                 # Project scripts and dependencies
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0+ or v20.0+
* **npm**: v9.0+

### Installation
```bash
# 1. Clone repository
git clone https://github.com/rocker-bell/MarketRadar.git
cd MarketRadar

# 2. Install dependencies
npm install

# 3. Configure CoinMarketCap API Key in .env
# Create a .env file in the root directory:
CMC_VITE_API=your_coinmarketcap_api_key_here

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173/#/dashboard` to launch the terminal locally.

---

## 🏆 Hackathon Track & Scoring Alignment

### Track: **Markets and Trading Tools**
* **Does it work? (30 pts)**: Zero rate-limit failures through automated 60-second caching and an instant snapshot fallback mode.
* **Usefulness to a real person (25 pts)**: Instead of replicating basic gainers lists, MarketRadar calculates volume/cap divergence, identifying stealth accumulation before breakouts.
* **Interesting use of the API (20 pts)**: Merges listings, quotes, and category data to compute derived anomaly scores and liquidity turnover ratios.
* **Code quality and documentation (15 pts)**: Modular TypeScript, isolated CSS stylesheets, zero third-party framework entanglements, and dual web/extension build pipelines.
* **Presentation (10 pts)**: Hardware-inspired radar aesthetic featuring a perforated pore matrix texture and dark trading terminal color palette.

---

## License

© 2026 rocker_bell. All rights reserved.

This project and its source code are proprietary.

Only the owner (rocker_bell) or explicitly designated parties may use, copy, modify, merge, publish, distribute, sublicense, or sell any part of this project.

Any unauthorized use, reproduction, modification, or distribution by others is strictly prohibited.

## Note

This project and repository are actively maintained and regularly updated.
