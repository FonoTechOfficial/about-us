# fono.tech.llc

Company website — a zero-build, zero-dependency static site. Plain HTML, CSS, and JavaScript served as-is.

## Structure

```
.
├── index.html        # Semantic page: header / main (hero, about, services, approach, contact) / footer
├── .nojekyll         # Tells GitHub Pages to serve files as-is (skip Jekyll processing)
├── css/
│   ├── tokens.css    # Design tokens (CSS custom properties) — loaded first
│   ├── base.css      # Resets and element defaults — loaded second
│   └── layout.css    # Structural layout — loaded last
└── js/
    ├── i18n.js       # Internationalization scaffold — deferred, runs first
    └── main.js       # Site entry point — deferred, runs after i18n.js
```

## Local preview

No build step and no dependencies. Serve the directory with any static file server, e.g. Python's built-in one:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with `Ctrl+C`.

> Opening `index.html` directly via `file://` mostly works, but a local server matches how the
> site is served in production and avoids browser restrictions on some features.

## Deploy to GitHub Pages

This repository ships ready for GitHub Pages — the `.nojekyll` file ensures every asset (including
any future files or folders beginning with `_`) is served verbatim, without Jekyll processing.

1. Push the repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the branch (e.g. `main`) and the `/ (root)` folder, then **Save**.
5. Wait for the deployment to finish; your site will be live at
   `https://<username>.github.io/<repository>/`.

Subsequent pushes to the configured branch redeploy automatically.

## Current publish status

This `fono.tech.llc` repository is private, so the site is published from the public
`FonoTechOfficial/about-us` repository instead:

- **Live site:** <https://fonotechofficial.github.io/about-us/> (verified `200 OK` for
  `index.html`, `css/*.css`, and `js/*.js`)
- **Source repo:** <https://github.com/FonoTechOfficial/about-us> — `main` branch, root folder
- **Pages config:** `source.branch=main`, `source.path=/`, `build_type=legacy`, status `built`
  (confirmed via `gh api repos/FonoTechOfficial/about-us/pages`)

To republish after future changes here, copy the deployable files (`index.html`, `.nojekyll`,
`css/`, `js/`, `README.md` — not `acceptance/`) into a checkout of `about-us`, commit, and push
to its `main` branch. No separate build step is required.
