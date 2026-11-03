const express = require("express");
const router = express.Router();
const {
  countVerifiedUsers,
  getAllCustomers,
} = require("../../controllers/admin/verified-user-controller");
const { adminAuthMiddleware } = require("../../controllers/auth/auth-controller");

// Enforce admin privileges across all customer reporting endpoints
router.use(adminAuthMiddleware);

router.get("/", countVerifiedUsers);
router.get("/all", getAllCustomers);

module.exports = router;
