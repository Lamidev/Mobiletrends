const express = require("express");
const router = express.Router();
const { searchProducts } = require("../../controllers/shop/search-controller");

router.get("/:keyword", searchProducts);

module.exports = router;
