# Clinic Management System Frontend — Windows Setup

This folder is a standalone **React + Vite + JavaScript/JSX** frontend. It communicates only with the separate Laravel REST API; it does not contain a Node.js application backend.

| Requirement | Recommended local setup |
|---|---|
| Node.js | Current LTS release |
| Laravel API | Running at `http://127.0.0.1:8000` |
| Package manager | npm |

Open a terminal in this `client` folder, then run:

```powershell
npm install
npm run dev
```

The frontend calls the separate Laravel REST API at `http://127.0.0.1:8000/api` by default. Create a local `.env` file next to `package.json` with `VITE_API_BASE_URL=http://127.0.0.1:8000/api` when you want the endpoint to be explicit; the Axios client retains the same local URL as its fallback. If the Laravel API is intentionally hosted elsewhere, replace that value and restart the Vite process.

The package contains no platform-hosted images, Linux paths, workspace paths, or runtime-only integrations. The local branding asset is `public/assets/clinic-mark.svg`.
