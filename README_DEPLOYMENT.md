# Deployment Guide for Intern

## Current architecture
- Frontend: React app built with `react-scripts`.
- Backend: Express API in `backend/server.js`.
- Backend uses MongoDB via `mongoose` and falls back to `mongodb-memory-server` only in development.

## Deployment targets
- Frontend: Netlify is a good fit.
- Backend: Render is a common choice for Node/Express apps.

## Frontend deploy to Netlify
1. In Netlify, create a new site from GitHub and connect the `Intern` repo.
2. Set build command: `npm run build`.
3. Set publish directory: `frontend/build`.
4. Set environment variable (optional, if backend is deployed separately):
   - `REACT_APP_API_URL=https://<render-backend-url>/api`

## Backend deploy to Render
1. In Render, create a new Web Service from GitHub and connect the `Intern` repo.
2. Set root directory: `backend`.
3. Set build command: `npm install`.
4. Set start command: `npm start`.
5. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-production-mongodb-uri>`
   - `CLIENT_URL=https://intern-11392.netlify.app`
   - `JWT_SECRET=<your-secret>`

## Notes
- `backend/server.js` now refuses to start in production if MongoDB is unavailable.
- The frontend uses `process.env.REACT_APP_API_URL` to connect to the API.
- This repository has no existing Netlify or Render config files; deploy settings must be configured in the chosen service.
