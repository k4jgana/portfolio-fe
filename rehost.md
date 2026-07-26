# Manual rehost runbook

This deployment serves the portfolio with Docker/Nginx and keeps the backend in a separate container. Run these commands from the corresponding repository directories on the host.

## 1. Update the repositories

```sh
cd /path/to/portfolio-fe
git fetch origin
git checkout master
git pull --ff-only origin master

cd ../portfolio-be
git fetch origin
git checkout main
git pull --ff-only origin main
```

Keep each repository's `.env` on the host. Never commit it, the SQLite database, or `backups/`.

## 2. Rebuild and restart the backend

```sh
cd /path/to/portfolio-be
docker compose up -d --build --remove-orphans
docker compose ps
curl -fsS http://127.0.0.1:8000/health/ready
```

The compose file stores runtime data in the named `chatbot-data` volume and loads secrets from `.env`.

## 3. Rebuild and restart the frontend

```sh
cd /path/to/portfolio-fe
npm ci
npm run lint
npm run build
docker build -t portfolio-fe:latest .
docker rm -f portfolio-fe 2>/dev/null || true
docker run -d --restart unless-stopped -p 8080:80 --name portfolio-fe portfolio-fe:latest
```

The host Nginx/Certbot configuration should continue proxying `https://nenadkajgana.com/` to `127.0.0.1:8080` and `/ask` to `127.0.0.1:8000`.

## 4. Verify the rehost

```sh
curl -fsSIL https://nenadkajgana.com/
curl -fsS -X POST https://nenadkajgana.com/ask \
  -H 'Content-Type: application/json' \
  --data '{"query":"Say hello in one short sentence.","history":"","email":"guest"}'
docker ps
```

The first request should return HTTP 200 and the `/ask` response should contain a non-empty `answer`.

## Rollback

Keep the previous image tag before replacing `portfolio-fe:latest` (for example, `portfolio-fe:2026-07-26`). To roll back, stop the current frontend container and run the previous tag on port 8080. For source rollback, use `git revert` and redeploy; do not force-push or rewrite history.
