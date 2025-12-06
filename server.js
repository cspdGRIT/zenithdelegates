// server.js - Birthday Notifier Backend
// Run: npm install
// Then: node server.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const DATA_FILE = path.join(__dirname, 'birthdays.json');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write JSON
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Configure Nodemailer transporter via env vars
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('Warning: EMAIL_USER or EMAIL_PASS not set in environment. Email will not be sent.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// API: get birthdays
app.get('/api/birthdays', (req, res) => {
  const data = readData();
  res.json(data);
});

// API: add birthday
app.post('/api/birthdays', (req, res) => {
  const { name, date, email, phone, notes, party2025 } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'name and date required' });
  const data = readData();
  const id = Date.now().toString(36);
  data.push({ id, name, date, email: email || '', phone: phone || '', notes: notes || '', party2025: party2025 || '' });
  writeData(data);
  res.json({ success: true, id });
});

// API: delete
app.delete('/api/birthdays/:id', (req, res) => {
  const id = req.params.id;
  let data = readData();
  const beforeLen = data.length;
  data = data.filter(d => d.id !== id);
  writeData(data);
  res.json({ success: true, removed: beforeLen - data.length });
});

// API: import sample (for convenience)
app.post('/api/import-sample', (req, res) => {
  const sample = req.body.sample || [];
  writeData(sample);
  res.json({ success: true, count: sample.length });
});

// Daily cron job at 00:00 Asia/Kolkata - sends email for anyone whose birthday is TODAY
cron.schedule('0 0 * * *', () => {
  try {
    const data = readData();
    const now = new Date();
    // Use India timezone by offsetting UTC -> IST. Node-cron runs in server's timezone; to be safe we compute using IST local time
    const istOffset = 5.5 * 60; // minutes
    const ist = new Date(Date.now() + (istOffset - now.getTimezoneOffset()) * 60000);
    const mm = String(ist.getMonth() + 1).padStart(2, '0');
    const dd = String(ist.getDate()).padStart(2, '0');
    const mmdd = `${mm}-${dd}`;

    const todays = data.filter(b => {
      // accepted date formats: YYYY-MM-DD or DD-MM-YYYY or MM-DD
      if (!b.date) return false;
      const d = b.date.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const parts = d.split('-');
        return `${parts[1]}-${parts[2]}` === mmdd;
      }
      if (/^\d{2}-\d{2}$/.test(d)) {
        return d === mmdd;
      }
      if (/^\d{2}\/\d{2}$/.test(d)) {
        const parts = d.split('/');
        return `${parts[0]}-${parts[1]}` === mmdd;
      }
      return false;
    });

    if (todays.length === 0) {
      console.log('No birthdays today (IST)', mmdd);
      return;
    }

    // Compose email
    const subject = `🎉 Birthday Today: ${todays.map(t=>t.name).join(', ')}`;
    const lines = todays.map(t => `• ${t.name} (${t.date})${t.phone ? ' • ' + t.phone : ''}${t.email ? ' • ' + t.email : ''}`);
    const text = `Hello,\n\nReminder: Today is the birthday of:\n\n${lines.join('\n')}\n\nCheers,\nBirthday Notifier`;

    const mailOptions = {
      from: EMAIL_USER,
      to: process.env.EMAIL_TO || EMAIL_USER,
      subject,
      text
    };

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.log('EMAIL not configured, would have sent:', mailOptions);
    } else {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error('Error sending birthday email', err);
        else console.log('Birthday email sent:', info.response);
      });
    }
  } catch (err) {
    console.error('Cron job error', err);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server started on', PORT);
});
