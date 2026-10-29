const { initializeTransaction, verifyTransaction } = require("../../helpers/paystack");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/products");
const { sendReceiptEmail } = require("../../mailtrap/emails")

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      deliveryPrice,
      orderDate,
      orderUpdateDate,
      payerId,
      cartId,
    } = req.body;

    const callbackUrl = process.env.CLIENT_URL + '/shop/paystack-return';

    const paystackData = {
      email: payerId,
      amount: Math.round(totalAmount * 100),
      currency: "NGN",
      callback_url: callbackUrl,
      metadata: {
        userId,
        cartId: cartId || `cart_${userId}_${Date.now()}`,
        custom_fields: [
          {
            display_name: "Order Type",
            variable_name: "order_type",
            value: "E-commerce Purchase"
          }
        ]
      },
    };

    const paymentResponse = await initializeTransaction(paystackData);

    if (paymentResponse && paymentResponse.status) {
      const newOrder = new Order({
        userId,
        cartId: cartId || `cart_${userId}_${Date.now()}`,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        deliveryPrice,
        orderDate,
        orderUpdateDate,
        paymentId: paymentResponse.data.reference,
        payerId,
      });

      await newOrder.save();

      res.status(201).json({
        success: true,
        approvalURL: paymentResponse.data.authorization_url,
        orderId: newOrder._id,
        reference: paymentResponse.data.reference,
      });
    } else {
      res.status(500).json({
        success: false,
        message: paymentResponse.message || "Failed to initialize Paystack transaction",
      });
    }
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the order",
      error: error.message,
    });
  }
};

const capturePayment = async (req, res) => {
  const { reference, orderId } = req.body;

  try {
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: reference",
      });
    }

    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else {
      order = await Order.findOne({ paymentId: reference });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const paymentVerification = await verifyTransaction(reference);

    if (!paymentVerification.status || paymentVerification.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: paymentVerification.data.message || "Payment verification failed",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        continue;
      }

      if (product.totalStock < item.quantity) {
        continue;
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    try {
      console.log(`Attempting to clear cart for userId: ${order.userId}`);
      const deletedCart = await Cart.deleteMany({ userId: order.userId });
      console.log(`Cart deletion result:`, deletedCart);
    } catch (cartError) {
      console.error("Cart deletion error after payment:", cartError);
    }

    if (order.paymentStatus === "paid") {
      try {
        await sendReceiptEmail(order.payerId, order);
      } catch (emailError) {
        console.error("Receipt email error:", emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      order,
    });
  } catch (error) {
    console.error("Capture payment error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while capturing payment",
      error: error.message,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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
    console.error("Get user orders error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
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
    console.error("Get order details error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const handlePaystackReturn = async (req, res) => {
  try {
    const { reference } = req.query;

    const paymentVerification = await verifyTransaction(reference);

    if (!paymentVerification.status || paymentVerification.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({ paymentId: reference });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Paystack payment callback received successfully",
      order,
    });
  } catch (error) {
    console.error("Paystack return handling error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while handling Paystack callback",
    });
  }
};

const findOrderByReference = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Reference is required",
      });
    }

    const order = await Order.findOne({ paymentId: reference });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this reference",
      });
    }

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        paymentId: order.paymentId,
        userId: order.userId,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus
      },
    });
  } catch (error) {
    console.error("Find order reference error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while finding the order",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  handlePaystackReturn,
  findOrderByReference
};