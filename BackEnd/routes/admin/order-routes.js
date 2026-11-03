const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getTotalNumberOfOrders,
  deleteOrder,
} = require("../../controllers/admin/order-controller");
const { adminAuthMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Enforce admin privileges across all admin order endpoints
router.use(adminAuthMiddleware);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.get("/total", getTotalNumberOfOrders);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
