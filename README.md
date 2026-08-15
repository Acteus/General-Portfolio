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
├── css/style.css    # Design system and responsive layout
├── js/main.js       # Interactions and progressive enhancement
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

The cloud/platform resume is linked from the navigation and hero section as `output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf`. The original `Resume.pdf` is retained as an older version while the portfolio is being polished.

## Deployment

This is a static site. GitHub Pages can serve the repository root from the selected branch. No build step is required.

## Contact

- Email: garrendullas@gmail.com
- GitHub: [@Acteus](https://github.com/Acteus)
