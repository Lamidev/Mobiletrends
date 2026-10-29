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

module.exports = {countVerifiedUsers};