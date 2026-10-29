const express = require("express");
const { getProductShareLink } = require("../../controllers/shop/share-controller");

const router = express.Router();

router.get("/:productId", getProductShareLink);

module.exports = router;
