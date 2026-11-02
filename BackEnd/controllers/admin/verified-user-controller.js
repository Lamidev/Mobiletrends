const User = require("../../models/users");

const countVerifiedUsers = async (req, res) => {
  try {
    // Count real customers only — exclude users tagged as admin or admin emails
    const allUsers = await User.find({}, "role email _id");
    const verifiedUserCount = allUsers.filter(
      (u) =>
        u.role !== "admin" &&
        !String(u.email || "").toLowerCase().includes("admin") &&
        !String(u._id || "").toLowerCase().endsWith("93eeb9")
    ).length;

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
    // Fetch customers only — exclude admin accounts and specific admin ID CUST-93EEB9
    const rawCustomers = await User.find({}, "-password").sort({ createdAt: -1 });
    const customers = rawCustomers.filter(
      (c) =>
        c.role !== "admin" &&
        !String(c.email || "").toLowerCase().includes("admin") &&
        !String(c._id || "").toLowerCase().endsWith("93eeb9")
    );

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
