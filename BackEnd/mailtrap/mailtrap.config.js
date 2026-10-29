require("dotenv").config();
const { MailtrapClient } = require("mailtrap");

// Load environment variables and ensure endpoint has protocol
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || "placeholder_token";
let MAILTRAP_ENDPOINT = process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io";

if (MAILTRAP_ENDPOINT && !MAILTRAP_ENDPOINT.startsWith("http")) {
  MAILTRAP_ENDPOINT = `https://${MAILTRAP_ENDPOINT}`;
}

// Initialize Mailtrap client
const mailtrapClient = new MailtrapClient({
  endpoint: MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io",
  token: MAILTRAP_TOKEN
});

// Define the sender details
const sender = {
  email: process.env.SENDER_EMAIL || "Admin@mobiletrends.com.ng",
  name: process.env.SENDER_NAME || "Mobiletrends Systems Limited"
};

module.exports = {
  mailtrapClient,
  sender,
  MAILTRAP_ENDPOINT
};
