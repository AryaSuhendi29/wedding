# Digital Wedding Invitation Website

A modern, mobile-first, editorial digital wedding invitation with real-time RSVP syncing to Google Sheets, live Wedding Wishes wall, countdown timer, Google Maps directions, and one-tap Google Calendar Save-The-Date integration.

## Quick Setup & Maintenance

1. **Edit Wedding Details (`config.js`)**:
   Open `config.js` and replace all `XXX` placeholders (Groom, Bride, Parents, Date & Time, Venue Address, Bank Account, Gift Delivery Address) and paste your Google Apps Script Web App URL.
2. **Add Media Assets (`assets/`)**:
   - `assets/images/hero-poster.jpg`, `groom.jpg`, `bride.jpg`, `gallery-1.jpg`..`gallery-4.jpg` (optimize to WebP/JPEG < 300 KB).
   - `assets/video/prewedding.mp4` (720p/1080p H.264 MP4 < 8 MB, muted loop).
   - `assets/audio/wedding-theme.mp3` (128 kbps MP3 < 3 MB).
3. **Connect Google Sheets Backend (`Code.gs`)**:
   - Open your Google Sheet -> **Extensions > Apps Script** -> paste `Code.gs` -> **Deploy > New deployment > Web app** (Execute as: *Me*, Who has access: *Anyone*).
4. **Deploy to GitHub Pages**:
   - Push this folder to your GitHub repository `main` branch and enable **Settings > Pages > Source: GitHub Actions**.
