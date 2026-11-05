const express = require("express");
const {
  getDeliverySettings,
  updateDeliverySettings,
} = require("../../controllers/common/delivery-settings-controller");

const router = express.Router();

router.get("/", getDeliverySettings);
router.put("/", updateDeliverySettings);

module.exports = router;

