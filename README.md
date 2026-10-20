# Protein Crunch website

Responsive website based on the supplied logo and menu image. Includes menu categories, search, item options, cart, checkout form, location permission flow and a Google Apps Script backend starter for COD orders.

## Files
- `index.html`, `styles.css`, `app.js` — website
- `config.js` — add Apps Script URL and verified shop coordinates
- `apps-script/Code.gs` — Google Sheets + email backend
- `SETUP-GUIDE.md` — setup instructions
- `assets/` — supplied logo and original menu image

## Before live use
Deploy Apps Script, configure its email and Sheet ID, paste the deployed URL into `config.js`, verify shop coordinates, and test a real test order. Online payments are not connected; COD only. The private Google Sheet acts as the initial dashboard. Do not put secrets in public files.
