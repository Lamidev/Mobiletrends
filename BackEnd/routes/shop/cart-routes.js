// const express = require("express");

// const {
//   addToCart,
//   fetchCartItems,
//   deleteCartItem,
//   updateCartItemQty,
// } = require("../../controllers/shop/cart-controller");

// const router = express.Router();

// router.post("/add", addToCart);
// router.get("/get/:userId", fetchCartItems);
// router.put("/update-cart", updateCartItemQty);
// router.delete("/:userId/:productId", deleteCartItem);

// module.exports = router;

const express = require("express");

const {
  addToCart,
  fetchCartItems,
  mergeCarts,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get", fetchCartItems);
router.post("/merge", mergeCarts);
router.put("/update-cart", updateCartItemQty);
router.delete("/delete", deleteCartItem);

module.exports = router;