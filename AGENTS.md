# AGENTS.md - portfolio-fe

This document tracks relevant automation, deployment, and configuration agents involved in building and shipping the portfolio-fe frontend. Use it for:

- Documenting deployment processes (Docker, Vite build, Nginx proxy)
- Recording integrations (CI/CD, linting, pre-deploy scripts)
- Noting workspace/project-specific customizations

## Agents & Automation

### Frontend Build & Deploy
- **Build agent:**
  - Uses Node.js (`npm install`, `npm run build`) and Vite for static asset generation.
  - Docker multi-stage build encapsulates all dependencies and outputs production-ready HTML/JS in `/dist`.

- **Deployment agent:**
  - Docker image (`portfolio-fe:latest`) runs Nginx to serve frontend assets statically.
  - Container is started with:
    ```sh
    docker build -t portfolio-fe:latest -f Dockerfile .
    docker run -d --rm -p 8080:80 --name portfolio-fe portfolio-fe:latest
    ```
  - Nginx config (external) proxies traffic from main domain (HTTP and HTTPS via Certbot/Let’s Encrypt) to the running container.

### Environment Variables
- Managed via `.env` at build time:
  - `VITE_BACKEND_URL=/ask` (relative path for API calls to backend)
  - No Firebase client configuration is used; the guest chat calls the backend through `/ask`.

### CI/CD (if configured)
- Can document GitHub Actions or other CI here if automating build/deploy with push hooks.

## Troubleshooting/History
- Rebuild with `docker build --no-cache ...` after environment or static asset changes.
- Explicitly remove old `dist/` to avoid stale asset issues.
- All Nginx and domain SSL certificate work should be repeatable as above.

---
_This file should be updated with any new build agent, CI/CD, or env/infra changes for portfolio-fe._
