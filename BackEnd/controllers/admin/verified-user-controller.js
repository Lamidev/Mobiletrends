const User = require("../../models/users");

const countVerifiedUsers = async (req, res) => {
  try {
    const verifiedUserCount = await User.countDocuments({ isVerified: true });
    res.status(200).json({
      success: true,
      verifiedUserCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

module.exports = { countVerifiedUsers, getAllCustomers };
