const express = require("express");
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  handlePaystackReturn,
  findOrderByReference,
} = require("../../controllers/shop/order-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", authMiddleware, getOrderDetails);
router.get("/paystack-return", handlePaystackReturn);
router.get("/find-by-reference/:reference", findOrderByReference);

module.exports = router;
