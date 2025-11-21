# DispatchIQ Demo – NTFR (React + Vite + Azure Static Web Apps)

This repo contains a **browser-based demo** of DispatchIQ plus a **minimal Azure Functions API** for Azure Static Web Apps.

## Local Run (Front-end only)

1. Install Node.js (https://nodejs.org)
2. Install deps:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

## Optional: Test Functions locally
- Requires Azure Functions Core Tools (https://aka.ms/azfunc-install)
```bash
cd api
npm install
npm start
```
Functions will run on http://localhost:7071 (endpoints: `/api/hello`, `/api/workorders`).

## Deploy to Azure Static Web Apps (step-by-step)

1. **Push to GitHub**: create a new repo and push this folder.
2. Go to **Azure Portal** → search **Static Web Apps** → **Create**.
   - **Source**: GitHub
   - **Build Preset**: React
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `dist`
3. Click **Review + Create** → **Create**. Azure will create a GitHub Action.
4. Wait for the Action to finish; you’ll get a **public URL** for your demo.
5. Test the API routes at `https://<YOUR-SWA>.azurestaticapps.net/api/hello`.

## Notes
- Tailwind is loaded via CDN for simplicity.
- In a real build, replace in-memory data with Azure SQL and wire OCR via Azure AI Document Intelligence.
