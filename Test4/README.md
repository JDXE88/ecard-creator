# ✉️ E-Card Sender

An interactive e-card experience hosted on GitHub/GitLab Pages. No server required.

## How it works

1. The **sender** opens `index.html`, fills in the recipient name, address, message and uploads (or links) a card image.
2. Clicking **Generate Shareable Link** produces a `card.html?...` URL with all the data encoded in query parameters.
3. The sender copies and shares the link (via email, WhatsApp, etc.).
4. The **recipient** opens the link and sees an interactive envelope — click to flip it, open the flap, reveal the card, then read the message.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Compose UI for the sender |
| `card.html` | Interactive envelope viewer for the recipient |
| `README.md` | This file |

> **Note:** The stamp image is embedded directly into `card.html` as a Base64 data URL, so no extra assets are needed.

## Deploying to GitHub Pages

1. Push these files to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` (or `master`) and folder to `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## Image tips

- **Uploaded images** are encoded as Base64 in the URL, which works but creates very long links.
- For the most reliable sharing, host your image on [Imgur](https://imgur.com) or similar and paste the direct URL into the "image URL" field instead.
