require("dotenv").config();
const https = require("https");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// Function to initialize a transaction
const initializeTransaction = (data) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify(data);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // Use your secret key
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let response = "";

      res.on("data", (chunk) => {
        response += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (error) {
          reject(new Error("Failed to parse Paystack response"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
};

// Function to verify a transaction
const verifyTransaction = (reference) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // Use your secret key
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let response = "";

      res.on("data", (chunk) => {
        response += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (error) {
          reject(new Error("Failed to parse Paystack verification response"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};

module.exports = {
  initializeTransaction,
  verifyTransaction, // Export the verifyTransaction function
  PAYSTACK_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY,
};
