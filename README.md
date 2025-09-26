# Orbit Kit – All‑in‑One Productivity (Material 3, No‑Build, GitHub Pages)

Orbit Kit is a beautiful, fast, and offline‑capable productivity web app built with Material Design 3 components (Material Web) delivered via CDN. It runs as a static site and deploys easily to GitHub Pages.

## Features
- Dashboard overview
- Tasks with IndexedDB storage
- Notes with IndexedDB
- Pomodoro timer
- Habits tracking with streaks
- Simple Kanban board
- Monthly calendar grid
- Embedded docs browser for Material links
- Search across app routes
- Settings with theme toggle (persisted)
- PWA: installable, offline cache, icons
- GitHub Pages ready (hash routing + 404 fallback)

## Tech
- Material Web (M3) via `https://esm.run/@material/web`
- IndexedDB via `https://esm.run/idb`
- Web Components (vanilla), no bundler required

## Local Dev
- Serve with any static server (CORS friendly), e.g.:
```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy to GitHub Pages
1. Commit all files to a repo.
2. Push to `main`.
3. In GitHub Settings → Pages, set Source: `Deploy from a branch`, Branch: `main` `/ (root)`.
4. Ensure `404.html` exists (redirect to `index.html#/`).
5. Open your site at `https://<user>.github.io/<repo>/`.

## Notes
- Hash‑based router ensures Pages serves deep links.
- Update `sw.js` ASSETS if you add files you want cached.

## License
MIT