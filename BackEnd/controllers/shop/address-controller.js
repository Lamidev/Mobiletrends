const Address = require("../../models/address");

const addAddress = async (req, res) => {
  try {
    const { userId, fullName, address, lga, state, phone, pincode, country, notes } = req.body;

    const targetUserId = req.userId || userId;

    if (!targetUserId || !fullName || !address || !lga || !state || !phone || !country) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    if (userId && req.userId && req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Cannot add address for another user.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId: targetUserId,
      fullName,
      address,
      lga,
      state,
      phone,
      country,
      notes,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.error("Add address error:", e);
    res.status(500).json({
      success: false,
      message: "Error creating address",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Cannot view another user's addresses.",
      });
    }

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.error("Fetch addresses error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Cannot edit another user's address.",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.error("Edit address error:", e);
    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Cannot delete another user's address.",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.error("Delete address error:", e);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
