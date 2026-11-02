const express = require("express");
const router = express.Router();
const {
  countVerifiedUsers,
  getAllCustomers,
} = require("../../controllers/admin/verified-user-controller");

router.get("/", countVerifiedUsers);
router.get("/all", getAllCustomers);

module.exports = router;
