# BuildTrack — Construction Expense Tracker

A multi-site construction expense tracking dashboard built with React, Vite, React Router, and Recharts.

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (typically `http://localhost:5173`).

## Demo Login

- **Username:** `admin`
- **Password:** `admin123`

## Features

- **Auth**: Mock login screen, session persisted in `localStorage`.
- **Site Management**: View/create unlimited construction sites, each with isolated data.
- **Per-Site Dashboard** (sidebar navigation):
  - **Overview**: Budget/expense/labor summary cards + Bar, Pie, and Line charts.
  - **Expenses**: Add/edit/delete expense entries, search & filter, category pie chart.
  - **Labor**: Add workers, mark attendance via calendar, auto-calculated wage totals (`daily wage × days present`), worker-cost bar chart, cost-over-time line chart.
  - **Budget Report**: Planned vs actual comparison, circular progress indicator, category spend breakdown, over/under budget banner.

## Tech Stack

- React 18 + Vite
- React Router DOM v6
- Recharts for data visualization
- Context API + localStorage for state/persistence (no backend required)
- lucide-react icons

## Project Structure

```
src/
  components/    → reusable UI (StatCard, Modal, ConfirmDialog, ProtectedRoute)
  context/       → AppContext (global state + localStorage sync)
  modules/       → feature modules (overview, expenses, labor, budget)
  pages/         → route-level pages (Login, Sites, SiteDashboard)
  utils/         → formatting helpers
```

All data is stored in your browser's `localStorage` — clearing site data will reset the app to defaults (Site A/B/C).
