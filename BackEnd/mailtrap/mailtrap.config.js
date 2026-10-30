require("dotenv").config();
const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// Initialize Resend client (only if API key is provided so server boot never crashes)
const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const senderEmail = process.env.SENDER_EMAIL || "Admin@mobiletrends.ng";
const senderName = process.env.SENDER_NAME || "Mobiletrends Systems Limited";

// Resend expects "Name <email@domain.com>"
const senderFrom = `${senderName} <${senderEmail}>`;

const sender = {
  email: senderEmail,
  name: senderName,
  from: senderFrom,
};

module.exports = {
  resendClient,
  sender,
  senderFrom,
};
