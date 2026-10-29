const THEME_COLOR = "#0C1172"; // Mobiletrends Blue
const ACCENT_COLOR = "#DF5E00"; // Mobiletrends Orange

const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, ${THEME_COLOR}, ${ACCENT_COLOR}); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: ${THEME_COLOR};">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
    <p>Best regards,<br>Mobiletrends Team</p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, ${THEME_COLOR}, ${ACCENT_COLOR}); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: ${THEME_COLOR}; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If this wasn't you, please contact support at <strong>Admin@mobiletrends.com.ng</strong>.</p>
    <p>For security:
      <ul>
        <li>Use a strong password</li>
        <li>Enable two-factor authentication</li>
        <li>Avoid reusing passwords</li>
      </ul>
    </p>
    <p>Best regards,<br>Mobiletrends Team</p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, ${THEME_COLOR}, ${ACCENT_COLOR}); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If this wasn't you, please ignore this email.</p>
    <p>Click the button below to reset your password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>Best regards,<br>Mobiletrends Team</p>
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
  <title>Order Receipt</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, ${THEME_COLOR}, ${ACCENT_COLOR}); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Order Receipt</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {userName},</p>
    <p>Thank you for your purchase! Your order has been confirmed.</p>
    <p><strong>Order ID:</strong> {orderId}</p>
    <p><strong>Payment Status:</strong> {paymentStatus}</p>
    <p><strong>Order Price:</strong> NGN {orderPrice}</p>
    <p><strong>Delivery Price:</strong> NGN {deliveryPrice}</p>
    <p><strong>Total Amount:</strong> NGN {totalAmount}</p>
    <p>Here is a summary of your order:</p>
    <ul>{cartItems}</ul>
    <p>Your order will be delivered to:</p>
    <p>{addressInfo}</p>

    <!-- Delivery Information Section -->
    <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 5px; border: 1px solid #eee;">
      <h3 style="color: ${THEME_COLOR}; margin-top: 0;">Delivery Information</h3>
      <p>Delivery: <strong>1-3 Business Days</strong></p>
      <p>You will receive a notification once your order has been shipped, along with a tracking update.</p>
      <p>If you have any questions about your delivery, feel free to contact our support team at <strong>Admin@mobiletrends.com.ng</strong> or call <strong>08034378180 / 08142528191</strong>.</p>
    </div>

    <p>Best regards,<br>Mobiletrends Systems Limited</p>
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
  <title>Welcome to Our Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, ${THEME_COLOR}, ${ACCENT_COLOR}); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Mobiletrends!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for subscribing to Mobiletrends newsletter! You're now on the list to receive the latest updates on new arrivals, exclusive gadget deals, and special offers.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: ${THEME_COLOR}; color: white; padding: 15px 25px; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 18px;">
        You're Subscribed! 🚀
      </div>
    </div>
    <p>We promise not to spam you. You'll only hear from us when we have something truly exciting to share.</p>
    <p>Best regards,<br>Mobiletrends Team</p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #333; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Subscriber Alert!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi Admin,</p>
    <p>You have a new subscriber to the Mobiletrends newsletter.</p>
    <div style="background-color: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd; margin: 20px 0;">
      <p style="margin: 0; font-size: 18px;"><strong>Email:</strong> {subscriberEmail}</p>
    </div>
    <p>This user subscribed on {subscriptionDate}.</p>
    <p>Check your dashboard for more details.</p>
  </div>
</body>
</html>
`;

module.exports = {
  THEME_COLOR,
  ACCENT_COLOR,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  ORDER_RECEIPT_TEMPLATE,
  NEWSLETTER_SUBSCRIPTION_TEMPLATE,
  ADMIN_NEWSLETTER_NOTIFICATION_TEMPLATE,
};
