# PowerMathSaya Interactive Visualization (React + Tailwind)

Modernized research dashboard for PowerMathSaya using:

- React (Vite)
- Tailwind CSS
- Framer Motion animations

## What this app includes

- Chapter-based storytelling with interactive chapter buttons and jump navigation.
- Data-driven ALNAT analytics from documented thesis values.
- Framework dashboard with focus/compare mode, section filter, and evaluator role filter.
- Paired slopegraph, distribution histogram with optional overlay, and radar profile charts.
- Pretest/posttest learner tables with search and rating filters.
- Responsive layout for desktop and mobile.
- Reduced-motion-aware behavior.

## Project structure

- `index.html`: Vite app entry with React mount.
- `src/main.jsx`: React bootstrap.
- `src/App.jsx`: page sections, interactions, and visual components.
- `src/data/researchData.js`: all research datasets and parsed learner pairs.
- `src/index.css`: Tailwind layers plus custom visual utilities.
- `tailwind.config.js`: Tailwind theme extension.
- `postcss.config.js`: PostCSS pipeline.
- `vercel.json`: Vercel build/output/header configuration.

## Local development

From `scrollverse`:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```powershell
npm run build
npm run preview
```

## Deploy on Vercel (browser flow)

1. Import repository in Vercel.
2. Set `Root Directory` to `scrollverse`.
3. Keep framework auto-detection (Vite).
4. Confirm build settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy.

## Data integrity note

All displayed values use documented thesis data in `src/data/researchData.js`.
No fabricated learners, no modified ALNAT scores, and no added absent learners are introduced.

## Defense and release checklist

- [THESIS_RELEASE_CHECKLIST.md](THESIS_RELEASE_CHECKLIST.md)
