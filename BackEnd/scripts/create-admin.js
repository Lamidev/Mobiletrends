require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage:
  1. Promote an existing user:
     node scripts/create-admin.js <email>

  2. Create a new admin account:
     node scripts/create-admin.js <email> <userName> <password> [phone]

Example:
  node scripts/create-admin.js Admin@mobiletrends.ng MobiletrendsAdmin MySecurePassword123!
`);
    process.exit(1);
  }

  const [email, userName, password, phone] = args;

  const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Error: MONGODB_URL is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // If only email was provided OR user already exists, promote to admin
    existingUser.role = "admin";
    existingUser.isVerified = true;
    if (password) {
      existingUser.password = await bcrypt.hash(password, 12);
    }
    if (userName) {
      existingUser.userName = userName;
    }
    await existingUser.save();
    console.log(`\n Successfully updated "${email}" to Admin role with isVerified = true!`);
  } else {
    // Create new admin
    if (!userName || !password) {
      console.error(`\n User with email "${email}" does not exist.`);
      console.log(`To create a new admin, supply userName and password:`);
      console.log(`  node scripts/create-admin.js ${email} <userName> <password>`);
      process.exit(1);
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newAdmin = new User({
      email,
      userName,
      password: hashPassword,
      phone: phone || "",
      role: "admin",
      isVerified: true,
    });

    await newAdmin.save();
    console.log(`\n Successfully created new Admin account!`);
    console.log(`  - Email:    ${email}`);
    console.log(`  - Username: ${userName}`);
    console.log(`  - Role:     admin`);
    console.log(`  - Verified: true\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating/updating admin:", err);
  process.exit(1);
});

