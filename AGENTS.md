# RTS Dashboard - Agent Instructions

## Project Structure

- **App lives in `rts-dashboard/`**, not at the repo root. `TEST/` also contains `description.md` (original spec) and CSV data files. All source is under `rts-dashboard/src/`.

## Commands

```bash
npm run dev       # Vite dev server (hot reload)
npm run build      # tsc -b && vite build
npm run lint        # eslint .
npm run preview     # vite preview (serve production build)
```

**Important**: There are **no tests** in this repo. Do not attempt to run a test suite.

## Architecture

- **State**: Zustand stores (`useDashboardStore` for data/filter state, `useThemeStore` for dark mode).
- **Layout**: `App.tsx` orchestrates header (with compact CSV upload) → FilterBar → top-half charts (Pie + Stacked Bar) → full-width Element 3 (employee breakdown) → Element A (detail table).
- **Data flow**: Filters in the top half (RTS codes, date range, employees, search) propagate down to update the charts and detail table in the bottom half.
- **CSV**: `lib/headerMap.ts` provides column-name → spreadsheet-column mappings (e.g. "D2IN Delivery Impact DCR" maps to column C, "RTS Code" maps to E). CSV parse uses `papaparse`.

## Styling

- **Dark mode** uses inline `style` props with HSL color values, not CSS classes. CSS variables are defined in `src/index.css`. ECharts tooltips use `.echarts-tooltip` class for custom styling.
- Tailwind is configured via `@tailwindcss/vite` plugin in `vite.config.ts`.

## Charts (ECharts)

- **Pie Chart**: Hover-only labels, click-to-filter on RTS codes. No static labels to avoid overlap.
- **Stacked Bar Chart**: Default shows "OODT" + "Other RTS". When filters are active, dynamically stacks all unique RTS codes from the filtered dataset. Uses `dataZoom` slider + `axis.interval: 'auto'` to prevent date label overlap.

## Deployment

- GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.

## Gotchas

- `tsc -b` is required before `vite build` because the project uses TypeScript project references (`tsconfig.app.json`, `tsconfig.node.json`).
- Dark/light theming is handled through Zustand's `useThemeStore` which persists the preference in `localStorage`.
- The FilterBar RTS toggles are checkbox-based multi-select; state is managed in `useDashboardStore`.
- DetailTable (`Element A`) shows columns: Delivery Associate (A), Tracking ID (B), Impact DCR (C), RTS Code (E), Additional Info (F), Exemption Reason (G), Planned Delivery Date (H). It supports column search and 50-row pagination.
