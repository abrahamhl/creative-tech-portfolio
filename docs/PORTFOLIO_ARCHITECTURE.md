# Portfolio Architecture

The portfolio utilizes a minimal, dependency-free Static Site Generator (SSG) approach.

## 1. Principles
- **No live CDNs for critical assets:** All fonts, core scripts, and styles must be either strictly inline or bundled locally at build time to prevent supply chain attacks and ensure the site operates without external points of failure.
- **Reproducible Builds:** The `pnpm` lockfile and `scripts/build.mjs` guarantee that every deployment yields the exact same static output.
- **Evidence Consolidation:** All claims made on the portfolio link directly to reproducible GitHub repositories (e.g., `loopsmith`, `stack-hub-ias`).

## 2. Pipeline
1. `pnpm install` (enforced via `only-allow pnpm`)
2. `pnpm run build` executes `scripts/build.mjs`
3. The script reads `src/template.html` and injects build-time variables (like timestamps or static JSON content).
4. The final HTML is emitted to `dist/index.html`.
5. The `dist/` directory is deployed via Vercel (configured in `vercel.json`).
