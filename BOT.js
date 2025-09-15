import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";

const app = express();
app.use(bodyParser.json());

// ⚙️ Env vars
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// 🔑 Google OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const peopleService = google.people({ version: "v1", auth: oAuth2Client });

// ✅ WhatsApp Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle Incoming Messages
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0]?.value?.messages;

    if (changes) {
      const msg = changes[0];
      const from = msg.from; // WhatsApp number

      console.log("Saving new contact:", from);

      // Save to Google Contacts
      await peopleService.people.createContact({
        requestBody: {
          names: [{ givenName: "WhatsApp Contact" }],
          phoneNumbers: [{ value: `+${from}` }],
        },
      });

      console.log("✅ Contact saved");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () =>
  console.log("🚀 WhatsApp bot running on http://localhost:3000")
);