# Nenad Kajgana — Portfolio frontend

A single-page React/Vite portfolio with a floating, guest-accessible AI assistant. The visible portfolio content is a versioned snapshot in `src/data/portfolio.v1.ts`; normal page rendering does not depend on the backend, Pinecone, or OpenAI.

## Local development

```sh
npm ci
npm run dev
```

`VITE_BACKEND_URL` is optional. When unset, the assistant sends `POST /ask` to the current origin. A localhost backend URL is ignored on production hosts so the reverse proxy can handle `/ask`.

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
