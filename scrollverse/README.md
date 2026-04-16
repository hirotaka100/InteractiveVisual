# Scrollverse Demo

An interactive, scroll-driven website prototype using **GSAP + ScrollTrigger**.

## What this demo includes

- Hero pinning with layered depth animation.
- Parallax typography field with independent motion layers.
- Horizontal gallery section controlled by vertical scrolling.
- Morphing clip-path corridor animation.
- Real-time scroll progress indicator.
- Reduced-motion support and keyboard-safe interactions.
- Responsive behavior for mobile and desktop.

## Files

- `index.html`: semantic structure and content sections.
- `styles.css`: design system tokens, layout, visual style, and responsive rules.
- `script.js`: animation timelines, ScrollTrigger logic, progress logic, and accessibility-aware behavior.

## Run locally

Because this project uses CDN scripts, you can run it in any static server setup.

Simple option from this folder:

```powershell
# If Python is available
python -m http.server 8080
```

Then open:

- http://localhost:8080

## Deploy Plan (Vercel)

Use this sequence so the site deploys from the `scrollverse` folder directly.

This folder already includes `vercel.json` for stable headers and static delivery defaults.

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Open Vercel and click `Add New...` then `Project`.
3. Import the repository.
4. In project settings, set `Root Directory` to `scrollverse`.
5. Set `Framework Preset` to `Other`.
6. Leave `Build Command` empty.
7. Set `Output Directory` to `.`.
8. Click `Deploy`.

### No-CLI Note

The Vercel CLI is optional and not required for this project. The dashboard flow above is enough.

### Post-Deploy Checklist

1. Confirm hero, chart, and filter interactions load correctly.
2. Confirm table filtering works for `Learner Search` and `Posttest Rating`.
3. Check mobile behavior on at least one phone-size viewport.
4. Enable a custom domain in Vercel if needed.

### Defense and Release Checklist

Use the complete checklist with exact screenshot requirements here:

- [THESIS_RELEASE_CHECKLIST.md](THESIS_RELEASE_CHECKLIST.md)

## Technical approach

- **Animation engine**: GSAP timelines for deterministic choreography.
- **Scroll orchestration**: ScrollTrigger `scrub` and `pin` for direct user-controlled motion.
- **Performance**:
  - Transform and opacity-focused animation paths.
  - `invalidateOnRefresh` for responsive recalculation.
  - Passive scroll listeners for progress UI updates.
- **Accessibility**:
  - `prefers-reduced-motion` disables high-intensity animations.
  - Skip link and visible focus-ready controls.

## Extension ideas

- Add Three.js particle layers behind the hero and sync camera depth to scroll progress.
- Introduce velocity-aware motion blur for high-speed scroll bursts.
- Use CMS-driven chapter data to generate dynamic scroll narratives.
- Add audio-reactive layers with explicit user consent and mute controls.
