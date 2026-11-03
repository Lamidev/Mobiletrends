const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/features-controller");
const { adminAuthMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/add", adminAuthMiddleware, addFeatureImage);
router.get("/get", getFeatureImages); // Public banner display
router.delete("/delete/:id", adminAuthMiddleware, deleteFeatureImage);

module.exports = router;
