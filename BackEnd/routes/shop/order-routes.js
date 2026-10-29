// const express = require("express");

// const {
//   createOrder,
//   getAllOrdersByUser,
//   getOrderDetails,

//   capturePayment,
// } = require("../../controllers/shop/order-controller");

// const router = express.Router();

// router.post("/create", createOrder);
// router.post("/capture", capturePayment);
// router.get("/list/:userId", getAllOrdersByUser);
// router.get("/details/:id", getOrderDetails);

// module.exports = router;

const express = require("express");
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  handlePaystackReturn,
  findOrderByReference
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.get("/paystack-return", handlePaystackReturn);
router.get("/find-by-reference/:reference", findOrderByReference);

module.exports = router;

