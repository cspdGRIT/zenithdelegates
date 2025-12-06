# Birthday Notifier

## Overview
Simple Node.js + Express app that stores birthdays and sends an email at midnight (Asia/Kolkata) for birthdays happening that day.

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=pdcind369@gmail.com
PORT=4000
```
> For Gmail, generate an App Password (recommended) or enable less secure apps (not recommended).

3. Start the server:
```bash
npm start
```

4. Open `http://localhost:4000` and use the frontend.

## Notes
- The cron job runs at 00:00 IST and emails `EMAIL_TO`. Ensure your server runs continuously (use pm2, systemd, or deploy to a platform like Render/Heroku).
