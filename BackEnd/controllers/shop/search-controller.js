const Product = require("../../models/products");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const escapedKeyword = keyword
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regEx = new RegExp(escapedKeyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
};

module.exports = { searchProducts };
