# Connect Protein Crunch to Google Sheets + email

This starter backend saves COD orders to a private Google Sheet and emails the shop owner. No WhatsApp API is used.

## 1. Create the private Sheet
1. In Google Drive, create a Google Sheet named **Protein Crunch Orders**.
2. Copy the ID from its URL: the characters between `/d/` and `/edit`.
3. Keep the sheet private and share it only with authorized shop staff. This Sheet is the first order dashboard; use its `Order Status` column to track New, Accepted, Preparing, Ready, Out for delivery, Delivered or Cancelled.

## 2. Set up Apps Script
1. Visit https://script.google.com and create a project.
2. Copy `apps-script/Code.gs` into the script editor.
3. Set `NOTIFICATION_EMAIL` to the shop inbox and `SPREADSHEET_ID` to the Sheet ID.
4. Save, then choose **Deploy → New deployment → Web app**.
5. Select **Execute as: Me** and **Who has access: Anyone** so the public website can submit orders. Authorize the requested permissions and deploy.
6. Copy the Web App URL ending in `/exec`. Opening it should display “Backend is online.”

## 3. Connect the website
1. Open `config.js` and paste the URL into `appsScriptUrl`.
2. Upload the website folder to your GitHub repository and enable GitHub Pages, or update the existing published repository.
3. Submit a test COD order. Confirm it appears in the Sheet and the notification email arrives before accepting real orders.

## 4. Set shop coordinates
The supplied Plus Code is `8MQ2+J5 Mysuru, Karnataka`. Resolve it to the exact shop pin in Google Maps and copy the latitude and longitude into `config.js` as `shopLatitude` and `shopLongitude`. Until set, the site deliberately will not claim a customer is eligible. The radius check is straight-line distance, not road distance.

## Important limits and security
- Online payments are not connected yet. This version only supports COD. A gateway must be configured separately, with payment verified server-side before marking an order paid.
- The Google Sheet itself is the private dashboard for this first version; no separate admin site is exposed.
- The Apps Script URL is public. The backend validates fields and totals but is not a full anti-spam system. Keep the Sheet private and test with a few controlled orders before advertising the site widely.
- Never put Google passwords, gateway secret keys or admin credentials in public website files.
- Email quotas apply to Apps Script. Verify the menu/prices and delivery details before launch.
