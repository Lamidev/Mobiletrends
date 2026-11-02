const Order = require("../../models/order");
const User = require("../../models/users");
const { sendOrderStatusUpdateEmail } = require("../../resend/emails");

// Get all orders by user
const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({ });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus, orderUpdateDate: new Date() },
      { new: true }
    );

    // Resolve recipient customer email
    let customerEmail = order.payerId || order.addressInfo?.email;
    if (!customerEmail && order.userId) {
      try {
        const userRecord = await User.findById(order.userId);
        if (userRecord?.email) customerEmail = userRecord.email;
      } catch (uErr) {
        console.warn("Could not find user for order notification:", uErr);
      }
    }

    // Dispatch customer email asynchronously
    if (customerEmail) {
      sendOrderStatusUpdateEmail(customerEmail, updatedOrder, orderStatus).catch((mailErr) => {
        console.error("Order update email sending failed:", mailErr);
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully and customer notified via email!",
      data: updatedOrder,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Get total number of orders
const getTotalNumberOfOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      totalOrders,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getTotalNumberOfOrders,
  deleteOrder,
};
