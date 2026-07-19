# AlgoTutorGen

This repository hosts an anonymous project showcase for **AlgoTutorGen**.

The site presents a high-level contract-guided synthesis workflow and four
runnable browser demos. It intentionally contains no author, affiliation,
contact information, manuscript, unpublished evaluation results, or external
repository link. Search indexing is disabled.

## Run locally

The repository is fully static and self-contained. It does not require a build step, an external CDN, or the original research checkout. You can open `index.html` directly, or serve the repository over HTTP:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Validate

Run the static integrity checks:

```bash
node tests/validate-showcase.mjs
node --check app.js
```

If Playwright is available, run the desktop, mobile, resource-link, and `file://` QA suite. Screenshots and reports are written to `/tmp/algotutorgen-showcase-qa` by default:

```bash
SHOWCASE_URL=http://127.0.0.1:4173/ python3 tests/run_qa.py
```

## Repository layout

- `assets/`: screenshots for the four live demos.
- `artifacts/`: four runnable, self-contained interactive tutors.
- `tests/`: static integrity checks and browser QA.
