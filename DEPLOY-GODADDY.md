# Deploying to GoDaddy

## Option A: GoDaddy Node.js app hosting ("My Apps" → Folder upload)
1. Run `npm run package:cpanel` (or use the zip Claude provides). Upload **`dist/nsm-website-godaddy.zip`** exactly as it is.
   `package.json` must be at the top level of the upload. Do **not** upload the source zip `nsm-website.zip` or a folder that contains another `nsm-website/` folder.
2. The bundle is prebuilt: GoDaddy runs `npm install`, `npm run build` (a no-op) and `npm start` (`node server.js`, which listens on `$PORT`).
3. Under **Manage Secrets**, add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, `LEAD_WEBHOOK_URL`; as variables add `DEFAULT_LLM_PROVIDER`, `BOOKING_URL`, `NEXT_PUBLIC_SITE_URL`.
4. Click **Update Preview**, check the preview URL, then **Publish to Live** and connect your custom domain.

## Option B: cPanel shared hosting

The site is a Next.js app with server features (AI chatbot, contact form, lead capture), so it runs as a **Node.js application** through cPanel's **Setup Node.js App**. Shared hosting usually lacks the memory to build Next.js, so you upload a **prebuilt** package and cPanel only installs the runtime packages.

## 0. Requirements
- In cPanel, **Software → Setup Node.js App** must exist. If it doesn't, your plan can't run Node.js: either upgrade to a GoDaddy plan with Node.js or VPS, or host the site on Vercel and point your GoDaddy domain at it.
- Node.js **20.9 or newer** in that tool (choose **22** if listed). Next.js 16 will not start on Node 18.
- About 600 MB of disk space and ~20,000 files (inodes) for the installed packages.

## 1. Build the package
On any Linux/macOS machine with Node 22 (or ask Claude to run it):
```bash
npm ci
npm run package:cpanel
```
This creates `dist/nsm-website-godaddy.zip` (same file also saved as `nsm-website-cpanel.zip`) (~4 MB): the prebuilt `.next` folder, `server.js`, `knowledge/`, `public/`, `package.json` and `package-lock.json`. It contains no `node_modules`.

## 2. Upload
1. cPanel → **File Manager**. In your home directory (not inside `public_html`), create a folder, e.g. `nsm-website`.
2. Upload `nsm-website-cpanel.zip` into it, then right-click → **Extract**. Delete the zip afterwards.
3. Do **not** upload a `node_modules` folder. cPanel's Node.js tool refuses to manage an app that has one.

## 3. Create the Node.js application
cPanel → **Setup Node.js App** → **Create Application**:

| Field | Value |
|---|---|
| Node.js version | 22.x (or 20.x) |
| Application mode | Production |
| Application root | `nsm-website` |
| Application URL | your domain (e.g. `nsmtechnologies.com`) |
| Application startup file | `server.js` |

Under **Environment variables**, add (see `.env.example`):

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DEFAULT_LLM_PROVIDER` | `anthropic` (or `openai`) |
| `LLM_FALLBACK_ORDER` | `openai,gemini` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | your key(s). Without one, the chatbot runs in offline mode |
| `LEAD_WEBHOOK_URL` | your CRM / n8n / Make / Zapier webhook. Without it, leads are only written to the app log |
| `BOOKING_URL` | your Cal.com / Calendly link |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |

Click **Create**.

## 4. Install packages and start
1. On the application's page, click **Run NPM Install** and wait for it to finish (a few minutes).
2. Click **Restart**.
3. Open your domain. You should see the NSM home page.

If NPM install fails for memory reasons, use cPanel → **Terminal**: copy the `source …/activate` command shown at the top of the application's page, run it, then `npm ci --omit=dev`.

## 5. HTTPS
cPanel → **SSL/TLS Status** → select the domain → **Run AutoSSL**. Once it's issued, the site is served over HTTPS.

## Updating the site
Rebuild with `npm run package:cpanel`, upload the new zip into the same folder, extract it (overwrite), and click **Restart**. Run **NPM Install** again only if `package.json` changed.

## Troubleshooting
| Symptom | Fix |
|---|---|
| "503" or "Incomplete response received from application" | Check `stderr.log` in the application root. Usually a missing NPM install or Node < 20.9 |
| "Cloudlinux NodeJS Selector demands to store node modules … in separate folder" | Delete the `node_modules` folder you uploaded, then Run NPM Install |
| Pages load but the chatbot says "Offline advisor mode" | Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, then Restart. Outbound HTTPS to the AI provider must be allowed by your host |
| Old site still showing | cPanel adds Passenger rules to the domain's `.htaccess`. Remove old files from `public_html` that override them (e.g. `index.html`) |

## Limits of shared hosting
- One process: the in-memory chat rate limiter works, but restarts reset it.
- The app may sleep when idle, so the first request after a quiet period can be slow.
- For higher traffic, move to a GoDaddy VPS (PM2 + Nginx) or Vercel. The code needs no changes.
