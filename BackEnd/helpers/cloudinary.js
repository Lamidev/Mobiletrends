const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dz3ofeehd",
  api_key: process.env.CLOUDINARY_API_KEY || "213145847927284",
  api_secret: process.env.CLOUDINARY_API_SECRET || "kKXvK5Vgt4itWE_G7nYkl7bsJjc",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
