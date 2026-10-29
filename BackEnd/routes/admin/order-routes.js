const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getTotalNumberOfOrders,
  deleteOrder,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.get("/total", getTotalNumberOfOrders); // New route for total orders
router.delete("/delete/:id", deleteOrder); // New route for deleting an order

module.exports = router;

