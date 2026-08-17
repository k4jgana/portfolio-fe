# Nenad Kajgana — Portfolio frontend

A single-page React/Vite portfolio with a floating, guest-accessible AI assistant. The visible portfolio content is a versioned snapshot in `src/data/portfolio.v1.ts`; normal page rendering does not depend on the backend, Pinecone, or OpenAI.

## Local development

```sh
npm ci
npm run dev
```

`VITE_BACKEND_URL` is optional. When unset, the assistant sends `POST /ask` to the current origin. A localhost backend URL is ignored on production hosts so the reverse proxy can handle `/ask`.

The private `/cdinja` route uses same-origin `/cd-api` requests. Vite proxies those requests to
the local backend during development, and the container Nginx config proxies them in production.
It uses Firebase Google sign-in and sends the signed-in user's ID token with each request. Set
the `VITE_FIREBASE_*` client variables in `.env`, enable Google as a Firebase Authentication
provider, and add both the local and deployed domains to Firebase's authorized domains.
The frontend `.env` contains browser-visible configuration (never service-account credentials)
and is included only in Docker's build stage so Vite can compile those values into the app.

## Checks

```sh
npm run lint
npm run build
```

## Container deployment

```sh
docker build -t portfolio-fe:latest .
docker run -d --rm -p 8080:80 --name portfolio-fe portfolio-fe:latest
```
