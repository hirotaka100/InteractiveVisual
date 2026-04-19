# PowerMathSaya Release and Defense Checklist

Use this checklist before deployment and before your thesis defense demo.

## 1. Release Gate (Must Pass)

1. Open the site and verify all sections load without layout breaks.
2. Verify learner filters work: search, rating dropdown, and reset button.
3. Verify per-learner tables open and show 56 rows each when unfiltered.
4. Verify charts and bars animate on desktop.
5. Verify adaptive behavior on mobile viewport (390 x 844).
6. Verify `vercel.json` is present in this folder.

## 2. Vercel Deployment Runbook

1. Push latest code to your Git repository.
2. In Vercel, click Add New then Project.
3. Import the repository.
4. Set Root Directory to `scrollverse`.
5. Set Framework Preset to `Other`.
6. Leave Build Command empty.
7. Set Output Directory to `.`.
8. Click Deploy.
9. Open the deployed URL and run the Post-Deploy checks below.

## 3. Post-Deploy Checks

1. Hero section and scroll progress show correctly.
2. Comparison section shows Chapter 4 and Chapter 5 values together.
3. Discrepancy note is visible.
4. Learner search and rating filter update both tables at the same time.
5. Insight cards update after filtering (match count, averages, mean gain).
6. No console errors on first page load.

## 4. Exact Screenshot Capture List

Capture on desktop first (1366 x 768 or wider), then one mobile viewport (390 x 844).

1. `01-hero-overview-desktop.png`
2. `02-methodology-snapshot-desktop.png`
3. `03-baseline-pretest-bar-desktop.png`
4. `04-intervention-modules-desktop.png`
5. `05-pre-vs-post-comparison-desktop.png`
6. `06-discrepancy-note-desktop.png`
7. `07-statistical-evidence-desktop.png`
8. `08-quality-and-it-scores-desktop.png`
9. `09-recommendations-desktop.png`
10. `10-learner-table-unfiltered-desktop.png`
11. `11-learner-filter-transforming-desktop.png`
12. `12-mobile-view-filtered.png`

## 5. Screenshot Content Requirements

1. Shot 01: Title, subtitle, metrics, and progress indicator visible.
2. Shot 02: Four methodology cards visible.
3. Shot 03: Baseline pretest bar with 56 learners in Needs Major Support.
4. Shot 04: Four PowerMathSaya modules visible.
5. Shot 05: Pre, Post Ch4, and Post Ch5 bars visible in one frame.
6. Shot 06: Discrepancy note text visible.
7. Shot 07: Mean, SD, t-value, p-value, and CI cards visible.
8. Shot 08: LRMDS and IT score bars visible.
9. Shot 09: Recommendation cards with frequency tags visible.
10. Shot 10: Both pretest and posttest expandable tables visible.
11. Shot 11: Rating filter set to Transforming with reduced matched rows.
12. Shot 12: Mobile viewport showing interactive filters and table area.

## 6. Live Demo Flow (8 to 10 Minutes)

1. Intro and problem context from hero section.
2. Explain Chapter 3 method snapshot.
3. Show Chapter 4 baseline and intervention modules.
4. Show comparison chart and discrepancy transparency.
5. Show statistical evidence and evaluation scores.
6. Demonstrate learner search and rating filter live.
7. End with conclusion and deployment readiness.

## 7. Backup Plan During Defense

1. Keep one browser tab open to deployed Vercel URL.
2. Keep one local fallback tab running on `http://localhost:8080`.
3. Keep screenshot folder ready for offline explanation if network fails.

## 8. Submission Pack

1. Deployed URL.
2. Source repository URL.
3. All 12 screenshots from the list.
4. One PDF or slide deck that follows the demo flow sequence.
