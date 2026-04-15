# ✉ Resend Email Tester

A sleek developer UI for testing email sending via the [Resend](https://resend.com) API.

## Features

- 🔑 Secure API key input (toggle visibility)
- 📧 From, To, Subject fields
- 💻 HTML email body editor with live preview tab
- 📋 Import templates from your Resend account
- 📊 Result panel with syntax-highlighted JSON responses
- ⌨️  `Cmd/Ctrl+Enter` keyboard shortcut to send

## Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Then open **http://localhost:3001** in your browser.

## Usage

1. Enter your Resend API key (get one at [resend.com/api-keys](https://resend.com/api-keys))
2. Fill in **From**, **To**, and **Subject**
3. Write your HTML body in the editor — or click **Fetch Templates** to load templates from your Resend account, select one, and click **Import**
4. Switch to **Preview** tab to visually check the email
5. Click **Send Email** (or press `Cmd+Enter`)
6. Check the **Result** panel on the right for the API response

## Notes

- The **From** address must be from a verified domain in your Resend account
- Templates are fetched live from the Resend API using your key
- All API calls are proxied through the local Express server (no CORS issues)
