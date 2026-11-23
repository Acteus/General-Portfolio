# Garren Dullas — Cloud & Platform Engineering Portfolio

Static GitHub Pages portfolio for Garren Dullas, an Information Technology student focused on deploying and operating cloud-hosted backend systems.

Live site: [https://acteus.github.io](https://acteus.github.io)

## Focus

The portfolio is organized around three signals:

- Cloud and platform operations: Azure Container Apps, Azure Container Registry, Docker, Podman, GitHub Actions, Linux, managed identity, and logging.
- Backend systems: Python, FastAPI, PHP, Laravel, SQL, Caddy, Quadlet, and shell scripting.
- Supporting application and data work: JavaScript, TypeScript, React, Flutter, TensorFlow, NLP, and causal inference.

Projects are labeled by their actual status, including public repository, private project, in development, and link pending.

## Stack

- HTML5 and semantic markup
- Custom CSS with responsive dark/light themes
- Vanilla JavaScript for navigation, filtering, theme persistence, and mailto-based contact drafting
- AOS for optional scroll reveals
- Font Awesome for interface icons
- GitHub Pages for hosting

## Files

```text
.
├── index.html       # Portfolio content and structure
├── css/style.css    # Shared site styles and legacy journal materials
├── css/journal.css  # Stable journal layout, evidence type, and reading fallback
├── js/main.js       # Theme, navigation, filtering, and contact
├── js/journal-flip.js # Project/spread selection, page turns, and deep links
├── output/pdf/      # Generated resume variants
└── README.md        # Project documentation
```

## Local preview

Run a local static server from the repository root:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Updating content

Project descriptions, links, status labels, skills, and contact information live in `index.html`. Keep project claims aligned with evidence: distinguish deployed systems from private work, prototypes, and planned case studies.

All navigation and hero resume links serve `output/pdf/Garren-Dullas-Intern-Resume.pdf`. The supplied November resume is preserved as `output/pdf/Garren-Dullas-Intern-Resume-Original.pdf`. Edit `resume/intern-resume.html` and run `node scripts/build_intern_resume.cjs` with Playwright Chromium to regenerate the refined one-page PDF. The older cloud/platform PDF remains archived.

## Deployment

This is a static site. GitHub Pages can serve the repository root from the selected branch. No build step is required.

## Contact

- Email: garrendullas@gmail.com
- GitHub: [@Acteus](https://github.com/Acteus)

## Journal behavior and verification

The five notes lead with LaborWise, JobBoard DevOps, and completed JRU Atlas, followed by Project Archive and the Discord bot. The old `#note-private-work` link resolves to Atlas. On wide screens (75rem and above), each project has two spreads: story/architecture, followed by details/evidence or deployment/reliability. The book retains its dimensions as projects and spreads change. Narrow screens, enlarged text, and no-JavaScript sessions use a flowing reading layout; reduced motion skips the turning leaf.

Run source/controller checks with `node --test tests/*.mjs`. With Playwright and Chromium installed, run `node tests/journal-browser.cjs` for desktop geometry, pagination, keyboard focus, rapid navigation, deep links, responsive reflow, enlarged text, reduced motion, dark mode, offline resources, and no-JavaScript behavior. Browser screenshots are written to the system temporary directory.

## Case studies and evidence

`case-studies/laborwise.html` provides the public live-app link, a real landing-page capture, and an explicitly labeled architecture/release summary. `case-studies/atlas.html` summarizes the documented AWS EC2/ECR/SSM release and rollback boundary. Neither page claims to publish private execution logs or independently verify the backend. Do not replace source-backed evidence with generated screenshots or invented metrics.
