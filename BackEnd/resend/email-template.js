const THEME_COLOR = "#111344"; // Mobiletrends Deep Navy
const ACCENT_COLOR = "#DF5E00"; // Mobiletrends Orange

const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Mobiletrends</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
    <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px;">Mobiletrends Systems Limited</p>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello,</p>
    <p>Thank you for creating an account with <strong>Mobiletrends Systems Limited</strong>. Use the verification code below to complete your sign-up:</p>
    <div style="text-align: center; margin: 28px 0; padding: 18px; background-color: #f4f5f7; border-radius: 8px; border: 1px solid #e2e8f0;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: ${THEME_COLOR};">{verificationCode}</span>
    </div>
    <p style="font-size: 13.5px; color: #62665d;">Enter this code on the verification page to activate your account. This code expires in <strong>15 minutes</strong>.</p>
    <p style="font-size: 13.5px; color: #62665d;">If you did not create an account with Mobiletrends, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong><br>Akure, Ondo State · Nationwide Delivery</p>
  </div>
</body>
</html>
`;

const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mobiletrends</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Mobiletrends!</h1>
    <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px;">Your Trusted Plug for Authentic Gadgets</p>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello <strong>{userName}</strong>,</p>
    <p>Your email has been verified and your <strong>Mobiletrends</strong> account is now active.</p>
    <p>Whether you're shopping for a factory-sealed smartphone, a clean UK-used laptop, gaming consoles, or everyday accessories, every device we ship is thoroughly tested and backed by our store warranty.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="{shopURL}" style="background-color: ${THEME_COLOR}; color: #ffffff; padding: 13px 26px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">Explore Our Catalogue</a>
    </div>
    <p style="font-size: 13.5px; color: #62665d;">Need help choosing a specification or checking live battery stats? Reply to this email or chat with our team on WhatsApp at <strong>08034378180</strong>.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong></p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello,</p>
    <p>Your <strong>Mobiletrends</strong> account password has been successfully updated.</p>
    <div style="text-align: center; margin: 26px 0;">
      <div style="background-color: ${THEME_COLOR}; color: #ffffff; width: 52px; height: 52px; line-height: 52px; border-radius: 50%; display: inline-block; font-size: 26px; font-weight: bold;">
        ✓
      </div>
    </div>
    <p style="font-size: 13.5px; color: #62665d;">If you did not perform this action, please contact our support team immediately at <strong>Admin@mobiletrends.ng</strong> or call <strong>08034378180</strong>.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong></p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Reset Your Password</h1>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello,</p>
    <p>We received a request to reset the password for your <strong>Mobiletrends</strong> account. Click the button below to choose a new password:</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="{resetURL}" style="background-color: ${THEME_COLOR}; color: #ffffff; padding: 13px 26px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">Reset Password</a>
    </div>
    <p style="font-size: 13.5px; color: #62665d;">This password reset link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong></p>
  </div>
</body>
</html>
`;

const ORDER_RECEIPT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Mobiletrends Order Receipt</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed</h1>
    <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px;">Order #{orderId}</p>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello <strong>{userName}</strong>,</p>
    <p>Thank you for shopping with <strong>Mobiletrends Systems Limited</strong>! Your order has been confirmed and is being prepared.</p>

    <div style="background-color: #f4f5f7; padding: 16px 18px; border-radius: 6px; margin: 20px 0; font-size: 14px;">
      <p style="margin: 4px 0;"><strong>Order ID:</strong> {orderId}</p>
      <p style="margin: 4px 0;"><strong>Payment Status:</strong> {paymentStatus}</p>
      <p style="margin: 4px 0;"><strong>Items Subtotal:</strong> {orderPrice}</p>
      <p style="margin: 4px 0;"><strong>Delivery Fee:</strong> {deliveryPrice}</p>
      <p style="margin: 8px 0 0; font-size: 16px; color: ${THEME_COLOR};"><strong>Total Paid:</strong> {totalAmount}</p>
    </div>

    <h3 style="font-size: 15px; margin-bottom: 8px; color: #20231e;">Items Ordered</h3>
    <ul style="padding-left: 20px; margin-top: 0; font-size: 14px; color: #374151;">{cartItems}</ul>

    <h3 style="font-size: 15px; margin-bottom: 6px; color: #20231e;">Delivery Address</h3>
    <p style="margin-top: 0; font-size: 13.5px; color: #62665d;">{addressInfo}</p>

    <div style="margin-top: 22px; padding: 16px; background-color: #fafaf8; border-radius: 6px; border: 1px solid #daddd4; font-size: 13px; color: #62665d;">
      <h4 style="color: #20231e; margin: 0 0 6px; font-size: 14px;">Delivery &amp; Support</h4>
      <p style="margin: 0 0 6px;">Same-day delivery within Akure · <strong>1–2 Business Days</strong> for nationwide waybill.</p>
      <p style="margin: 0;">Questions? Contact us at <strong>Admin@mobiletrends.ng</strong> or WhatsApp/Call <strong>08034378180 / 08142528191</strong>.</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong></p>
  </div>
</body>
</html>
`;

const NEWSLETTER_SUBSCRIPTION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mobiletrends Updates</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 26px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Welcome to Mobiletrends!</h1>
  </div>
  <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hello,</p>
    <p>Thank you for subscribing to Mobiletrends updates! You'll be the first to know about new flagship arrivals, clean UK-used stock drops, and special offers.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; font-size: 12.5px; color: #62665d;">Best regards,<br><strong style="color: #20231e;">Mobiletrends Systems Limited</strong></p>
  </div>
</body>
</html>
`;

const ADMIN_NEWSLETTER_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Newsletter Subscriber</title>
</head>
<body style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #20231e; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafaf8;">
  <div style="background-color: ${THEME_COLOR}; padding: 22px 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Newsletter Subscriber</h1>
  </div>
  <div style="background-color: #ffffff; padding: 24px; border: 1px solid #daddd4; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hi Admin,</p>
    <p>A new user subscribed to the Mobiletrends newsletter:</p>
    <div style="background-color: #f4f5f7; padding: 14px 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 0; font-size: 15px;"><strong>Email:</strong> {subscriberEmail}</p>
      <p style="margin: 6px 0 0; font-size: 12.5px; color: #62665d;">Subscribed on {subscriptionDate}</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  THEME_COLOR,
  ACCENT_COLOR,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  ORDER_RECEIPT_TEMPLATE,
  NEWSLETTER_SUBSCRIPTION_TEMPLATE,
  ADMIN_NEWSLETTER_NOTIFICATION_TEMPLATE,
};
