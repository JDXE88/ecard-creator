# ✉️ E-Card Sender

An interactive e-card experience hosted on GitHub/GitLab Pages. No server required.

## Features
- 3 envelope shapes: Landscape, Portrait, Square
- 8 envelope colours
- 4-page card: Front cover, Inside Left, Inside Right (message), Back
- 6 font choices for your message
- Entirely URL-driven — no backend needed

## How it works
1. Sender opens `index.html`, fills in all details and generates a shareable link
2. Recipient opens the link → interactive envelope appears
3. Click to flip → click to open flap → card slides out → open the book to read

## Files
| File | Purpose |
|------|---------|
| `index.html` | Compose UI for the sender |
| `card.html` | Interactive card experience for the recipient |
| `README.md` | This file |

## GitHub Pages setup
1. Push files to repo root
2. Settings → Pages → Source: main branch, / (root)
3. Live at `https://<username>.github.io/<repo>/`

## Image tip
Uploaded images are embedded as Base64 in the URL (long links).
For best results, host images on Imgur and paste the URL instead.
