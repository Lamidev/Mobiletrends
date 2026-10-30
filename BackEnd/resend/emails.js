const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  ORDER_RECEIPT_TEMPLATE,
  NEWSLETTER_SUBSCRIPTION_TEMPLATE,
  ADMIN_NEWSLETTER_NOTIFICATION_TEMPLATE,
} = require("./email-template.js");
const { resendClient, senderFrom } = require("./resend.config.js");

const MAIL_USER_INFO = process.env.ADMIN_EMAIL || "Admin@mobiletrends.ng";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://mobiletrends.ng";

// Unified Resend sender helper
const sendWithResend = async ({ to, subject, html }, contextLabel) => {
  if (!resendClient) {
    console.warn(
      `[Resend] RESEND_API_KEY is not configured. Skipped sending "${subject}" to ${to}.`
    );
    return false;
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];
    const { data, error } = await resendClient.emails.send({
      from: senderFrom,
      to: recipients,
      subject,
      html,
    });

    if (error) {
      console.error(`[Resend] ${contextLabel}:`, error);
      return false;
    }

    console.log(`[Resend] Sent "${subject}" (${data?.id || "ok"})`);
    return true;
  } catch (err) {
    console.error(`[Resend] ${contextLabel}:`, err.message || err);
    return false;
  }
};

// Format order ID consistently - handle both string and ObjectId
const formatOrderId = (id) => {
  if (!id) return "N/A";
  const idString = id.toString ? id.toString() : String(id);
  return `ORD${idString.slice(-8).toUpperCase()}`;
};

// Format Naira amounts with commas
const formatNaira = (amount) => {
  if (!amount) return "₦0";
  return `₦${Number(amount).toLocaleString("en-NG")}`;
};

// 1. Send Verification Email
exports.sendVerificationEmail = async (email, verificationToken) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  return sendWithResend(
    {
      to: email,
      subject: "Verify your email - Mobiletrends",
      html,
    },
    "Error sending verification email"
  );
};

// 2. Send Welcome Email
exports.sendWelcomeEmail = async (email, userName) => {
  const html = WELCOME_EMAIL_TEMPLATE.replace(
    /{userName}/g,
    userName || "Valued Customer"
  ).replace(/{shopURL}/g, `${FRONTEND_URL}/shop/listing`);

  return sendWithResend(
    {
      to: email,
      subject: "Welcome to Mobiletrends Systems Limited!",
      html,
    },
    "Error sending welcome email"
  );
};

// 3. Send Password Reset Email
exports.sendPasswordResetEmail = async (email, resetURL) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  return sendWithResend(
    {
      to: email,
      subject: "Reset your password - Mobiletrends",
      html,
    },
    "Error sending password reset email"
  );
};

// 4. Send Password Reset Success Email
exports.sendResetSuccessEmail = async (email) => {
  return sendWithResend(
    {
      to: email,
      subject: "Password Reset Successful - Mobiletrends",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    },
    "Error sending password reset success email"
  );
};

// 5. Send Order Receipt Email
exports.sendReceiptEmail = async (email, order) => {
  try {
    const cartItemsHTML = (order.cartItems || [])
      .map(
        (item) =>
          `<li>${item.title} — ${formatNaira(item.price)} × ${item.quantity} = <strong>${formatNaira(
            item.price * item.quantity
          )}</strong></li>`
      )
      .join("");

    const addressInfo = `
      ${order.addressInfo?.fullName || ""}<br>
      ${order.addressInfo?.address || ""}<br>
      ${order.addressInfo?.lga || ""}<br>
      ${order.addressInfo?.state || ""}<br>
      ${order.addressInfo?.phone || ""}
    `;

    const html = ORDER_RECEIPT_TEMPLATE.replace(
      /{userName}/g,
      order.payerId || order.addressInfo?.fullName || "Customer"
    )
      .replace(/{orderId}/g, formatOrderId(order._id))
      .replace(/{paymentStatus}/g, order.paymentStatus || "Confirmed")
      .replace(
        /{orderPrice}/g,
        formatNaira((order.totalAmount || 0) - (order.deliveryPrice || 0))
      )
      .replace(/{deliveryPrice}/g, formatNaira(order.deliveryPrice || 0))
      .replace(/{totalAmount}/g, formatNaira(order.totalAmount || 0))
      .replace(/{cartItems}/g, cartItemsHTML)
      .replace(/{addressInfo}/g, addressInfo);

    return sendWithResend(
      {
        to: email,
        subject: `Your Mobiletrends Order Receipt (#${formatOrderId(order._id)})`,
        html,
      },
      "Error sending order receipt email"
    );
  } catch (error) {
    console.error("[Resend] Error building order receipt email:", error);
    return false;
  }
};

// 6. Send Newsletter Welcome Email
exports.sendNewsletterWelcomeEmail = async (email) => {
  return sendWithResend(
    {
      to: email,
      subject: "Welcome to Mobiletrends Updates!",
      html: NEWSLETTER_SUBSCRIPTION_TEMPLATE,
    },
    "Error sending newsletter welcome email"
  );
};

// 7. Send Newsletter Admin Notification
exports.sendNewsletterAdminNotification = async (subscriberEmail) => {
  const html = ADMIN_NEWSLETTER_NOTIFICATION_TEMPLATE.replace(
    "{subscriberEmail}",
    subscriberEmail
  ).replace("{subscriptionDate}", new Date().toLocaleString());

  return sendWithResend(
    {
      to: MAIL_USER_INFO,
      subject: "New Newsletter Subscriber - Mobiletrends",
      html,
    },
    "Error sending newsletter admin notification"
  );
};
