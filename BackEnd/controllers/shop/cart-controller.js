const Cart = require("../../models/cart");
const Product = require("../../models/products");

function formatCartItems(items) {
  return items.map((item) => {
    const prod = item.productId;
    const basePrice = prod ? (prod.salePrice > 0 ? prod.salePrice : prod.price) : 0;
    const finalPrice = item.price != null && !isNaN(item.price) ? Number(item.price) : basePrice;

    return {
      _id: item._id,
      productId: prod ? prod._id : null,
      image: prod ? prod.image : null,
      title: prod ? prod.title : "Product not found",
      price: finalPrice,
      originalPrice: prod ? prod.price : null,
      salePrice: prod ? prod.salePrice : null,
      totalStock: prod ? prod.totalStock : null,
      quantity: item.quantity,
      selectedStorage: item.selectedStorage || "",
      selectedRam: item.selectedRam || "",
      selectedColor: item.selectedColor || "",
      selectedCondition: item.selectedCondition || "",
    };
  });
}

const addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      isGuest = false,
      selectedStorage = "",
      selectedRam = "",
      selectedColor = "",
      selectedCondition = "",
      price,
    } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        isGuest: isGuest,
      });
    }

    const itemPrice =
      price != null && !isNaN(price)
        ? Number(price)
        : product.salePrice > 0
        ? product.salePrice
        : product.price;

    const findCurrentProductIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (item.selectedStorage || "") === (selectedStorage || "") &&
        (item.selectedRam || "") === (selectedRam || "") &&
        (item.selectedColor || "") === (selectedColor || "") &&
        (item.selectedCondition || "") === (selectedCondition || "")
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({
        productId,
        quantity,
        selectedStorage: selectedStorage || "",
        selectedRam: selectedRam || "",
        selectedColor: selectedColor || "",
        selectedCondition: selectedCondition || "",
        price: itemPrice,
      });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
      if (price != null) {
        cart.items[findCurrentProductIndex].price = itemPrice;
      }
    }

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    const populateCartItems = formatCartItems(cart.items);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while adding product to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    const validItems = cart.items.filter((productItem) => productItem.productId);

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = formatCartItems(validItems);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Fetch cart items error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching cart items",
    });
  }
};

const mergeCarts = async (req, res) => {
  try {
    const { guestId, userId } = req.body;

    if (!guestId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID and User ID are required!",
      });
    }

    const guestCart = await Cart.findOne({ userId: guestId });
    const userCart = await Cart.findOne({ userId });

    if (!guestCart) {
      const finalCart = userCart || { userId, items: [] };
      return res.status(200).json({
        success: true,
        data: finalCart,
      });
    }

    if (!userCart) {
      guestCart.userId = userId;
      guestCart.isGuest = false;
      await guestCart.save();

      await guestCart.populate({
        path: "items.productId",
        select: "image title price salePrice totalStock",
      });

      const populateCartItems = formatCartItems(guestCart.items);

      return res.status(200).json({
        success: true,
        data: {
          ...guestCart._doc,
          items: populateCartItems,
        },
      });
    }

    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          (item.selectedStorage || "") === (guestItem.selectedStorage || "") &&
          (item.selectedRam || "") === (guestItem.selectedRam || "") &&
          (item.selectedColor || "") === (guestItem.selectedColor || "") &&
          (item.selectedCondition || "") === (guestItem.selectedCondition || "")
      );

      if (existingItemIndex > -1) {
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
    await Cart.deleteOne({ userId: guestId });

    await userCart.populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    const populateCartItems = formatCartItems(userCart.items);

    res.status(200).json({
      success: true,
      data: {
        ...userCart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Merge carts error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while merging carts",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, cartItemId, quantity } = req.body;

    if (!userId || (!productId && !cartItemId) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex((item) => {
      if (cartItemId && item._id) {
        return item._id.toString() === cartItemId;
      }
      return item.productId.toString() === productId;
    });

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    const populateCartItems = formatCartItems(cart.items);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while updating cart item quantity",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, cartItemId } = req.body;

    if (!userId || (!productId && !cartItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    if (cartItemId) {
      cart.items = cart.items.filter(
        (item) => item._id && item._id.toString() !== cartItemId
      );
    } else {
      cart.items = cart.items.filter(
        (item) => item.productId && item.productId._id.toString() !== productId
      );
    }

    await cart.save();

    const populateCartItems = formatCartItems(cart.items);

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting cart item",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
  mergeCarts,
};
