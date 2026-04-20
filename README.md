# Synchra – AI-Powered Traffic Controller

> Real-time crowd management dashboard for venues, stadiums, and large-scale events — powered by AI predictive analytics and Google Maps.

![Synchra Dashboard](https://img.shields.io/badge/status-live-brightgreen)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)
![Google Cloud Run](https://img.shields.io/badge/deployed-Cloud%20Run-blue)

---

## 🌐 Live Demo

**[https://synchra-714048528891.us-central1.run.app](https://synchra-714048528891.us-central1.run.app)**

---

## 🧠 Problem Statement

Managing crowd flow in high-density venues (concerts, stadiums, transit hubs) is a critical safety and experience challenge. Synchra uses AI-driven predictive models and real-time telemetry to give operators actionable intelligence — before problems occur.

---

## ✨ Features

### Live Flow
- Real-time venue telemetry: throughput (pax/h), average wait time, and density score
- Animated area chart tracking historical throughput over time using **Recharts**
- Metrics update every 3 seconds via a simulated data engine

### Zone Insights
- Interactive **Google Maps** overlay showing crowd density per gate using color-coded circles
- Clickable density circles with info popups showing zone name, density %, and wait time
- Bar chart comparison across all venue zones

### Predictive Alerts
- Chronological alert feed with severity levels: **Critical**, **Warning**, **Info**
- AI-driven predicted bottleneck timing and recommended interventions

### Synchra Agent Console
- Operator-facing AI chat interface with contextual responses
- Animated typing indicator while AI processes
- Quick-action suggestion chips for common operator commands

---

## ⚙️ Architecture

```
src/
├── App.jsx                     # Root component, state orchestration
├── App.test.jsx                # Full test suite (21 tests)
├── index.css                   # Design system + accessibility styles
├── setupTests.js               # Vitest + Testing Library setup
└── components/
    ├── Sidebar.jsx             # Accessible navigation sidebar
    ├── Topbar.jsx              # Status header with live clock
    ├── LiveFlowPanel.jsx       # Real-time metrics + Recharts chart
    ├── ZoneInsightsPanel.jsx   # Google Maps + bar chart
    ├── AlertsPanel.jsx         # AI predictive alerts feed
    └── AgentConsole.jsx        # AI operator chat console
```

---

## 🔧 Google Services Used

| Service | Usage |
|---|---|
| **Google Maps JavaScript API** | Interactive venue map with crowd density circle overlays |
| **Google Cloud Run** | Serverless container deployment for global public access |
| **Google Fonts** | `Outfit` typeface via `fonts.googleapis.com` |

---

## ♿ Accessibility

- Full keyboard navigation with `:focus-visible` outlines
- ARIA landmarks: `<aside>`, `<main>`, `<nav>`, `<header>`, `<section>`
- `aria-live="polite"` on the agent console for screen reader announcements
- `aria-current="page"` on active navigation tab
- Screen-reader-only `<span class="sr-only">` for icon-only buttons
- Skip navigation link for keyboard users
- All interactive elements have `aria-label` attributes
- Semantic `<time>` element for the live clock
- `<meta name="description">` and `Content-Security-Policy` in HTML

---

## 🧪 Testing

**21 tests** covering rendering, tab navigation, agent console, and accessibility.

```bash
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

Test suites:
- **Rendering** – Brand, navigation tabs, default panel, welcome message
- **Tab Navigation** – Live Flow ↔ Zone Insights ↔ Predictive Alerts switching and `aria-current`
- **Agent Console** – Message send, typing indicator, quick actions, input clearing
- **Accessibility** – Landmarks, aria-live, labelled buttons

---

## 🚀 Local Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE" > .env

# Run dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## ☁️ Deployment

Deployed to **Google Cloud Run** using source-based deployment:

```bash
gcloud run deploy synchra \
  --source . \
  --project synchra-493718 \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool + dev server |
| Recharts | Data visualisation |
| Google Maps JS API | Interactive venue mapping |
| @googlemaps/js-api-loader | Async Maps API loading |
| Lucide React | Icon library |
| PropTypes | Runtime prop validation |
| Vitest | Unit test runner |
| Testing Library | DOM testing utilities |
| Express | Static file server |
| Docker | Container packaging |
| Google Cloud Run | Serverless deployment |
