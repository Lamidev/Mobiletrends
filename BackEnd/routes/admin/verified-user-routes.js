const express = require("express");
const router = express.Router();
const { countVerifiedUsers } = require("../../controllers/admin/verified-user-controller");

router.get("/", countVerifiedUsers);

module.exports = router;