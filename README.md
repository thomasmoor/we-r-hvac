# We R HVAC website

Payload CMS 3 (Next.js 16, SQLite) running **locally** for editing, with the public site exported as
static HTML to **GitHub Pages**.

```
 your PC                                   GitHub
 ┌─────────────────────────────┐   push    ┌───────────────────────────────┐
 │ Payload admin  /admin       │ ───────►  │ repo: content/site.json,      │
 │ SQLite: we-r-hvac.db        │           │       public/media, code      │
 │ every save → content/site.json          │ Action (on push + 01:00 UTC): │
 │ preview: http://localhost:3000          │  fetch reviews → build → Pages│
 └─────────────────────────────┘           └───────────────────────────────┘
```

## Run locally

```bash
npm install
npm run seed      # first time only: loads services, areas, settings and images
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (create your admin user on first visit)

## Editing content

| Admin section | What it controls |
| --- | --- |
| Content → Services | Service cards and pages (`/services/<slug>/`) |
| Content → Service areas | Area cards and pages (`/service-areas/<slug>/`) |
| Pages → Home page | Hero H1/H2/text, form title, section intros |
| Pages → About Us page | About image, H1/H2, text |
| Settings → Site settings & contact | Phone, email, address, hours, licence, brands, social links, Web3Forms key, GA4 ID, Google Place ID, reviews on/off |
| Leads → Form submissions | Requests sent from the **local** site |

Every save regenerates `content/site.json`, which is what the public site is built from.

## Publish to the live site

```bash
npm run publish:site
```

Commits `content/site.json` + `public/media` and pushes. GitHub Actions rebuilds and deploys in about 2 minutes.
Code changes are published with a normal `git commit` + `git push`.

Live URL: https://thomasmoor.github.io/we-r-hvac/

## Forms

- **Local site**: submissions are saved in Payload (Leads → Form submissions). No email.
- **Live site**: submissions are emailed by [Web3Forms](https://web3forms.com). Create a free access key with
  `contact@thomasmoor.org`, paste it into *Site settings → Forms*, then publish. Until a key is set the live form
  shows "please call".
- Spam: hidden honeypot field. Plan for launch: Cloudflare Turnstile.

## Google reviews (currently hidden)

1. In Google Cloud, enable **Places API (New)** and create an API key (restrict it to that API).
2. GitHub repo → Settings → Secrets and variables → Actions → add `GOOGLE_PLACES_API_KEY`.
3. In *Site settings → Google & SEO*, enter the business's **Place ID** and tick **Show reviews**, then publish.

The workflow runs daily at 01:00 UTC: one Place Details call per day (well inside the free tier). Google returns at
most 5 reviews. Locally: put the key in `.env` and run `npm run reviews`.

## Other commands

| Command | Purpose |
| --- | --- |
| `npm run build:static` | Build the static site into `out/` (stop `npm run dev` first) |
| `npm run preview:static` | Serve `out/` at http://localhost:4000/we-r-hvac/ |
| `npm run export:content` | Regenerate `content/site.json` manually |
| `npm run seed -- --force` | Reset services, areas and media to the initial content |
| `npm run typecheck` | TypeScript check |

## Notes

- `we-r-hvac.db` (content + leads) is **not** in Git — back it up yourself (e.g. copy to Dropbox).
- Photos: Unsplash (free licence), credits stored on each Media item.
- Hero video: compressed from `button.mp4` (1080p, no audio, ~2.2 MB); mobile shows the poster image only.
