const Product = require("../../models/products");

const getProductShareLink = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Determine the frontend URL
    let frontendBaseUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "https://mobiletrends.ng";

    // Ensure no trailing slash
    if (frontendBaseUrl.endsWith("/")) {
      frontendBaseUrl = frontendBaseUrl.slice(0, -1);
    }

    // Construct the actual deep link
    const targetUrl = `${frontendBaseUrl}/shop/listing?product=${productId}`;

    // Use the first image if it's an array, or the image string itself
    const imageUrl = product.image;
    const title = product.title;
    const description = product.description
      ? product.description.substring(0, 150) + "..."
      : "Check out this product on Mobiletrends";
    const price = product.salePrice > 0 ? product.salePrice : product.price;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Mobiletrends</title>
    
    <!-- Redirect Fallback -->
    <meta http-equiv="refresh" content="0;url=${targetUrl}">
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="Price: ₦${price.toLocaleString("en-NG")} - ${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${targetUrl}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Mobiletrends">
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="Price: ₦${price.toLocaleString("en-NG")} - ${description}">
    <meta name="twitter:image" content="${imageUrl}">

    <style>
        body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf8; }
        .redirect-msg { text-align: center; color: #20231e; }
        .loader { border: 4px solid #e5e7eb; border-top: 4px solid #111344; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="redirect-msg">
        <div class="loader"></div>
        <p>Redirecting you to Mobiletrends...</p>
        <p><a href="${targetUrl}">Click here if you are not redirected</a></p>
    </div>
    <script>
        window.location.href = "${targetUrl}";
    </script>
</body>
</html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Error generating share link:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { getProductShareLink };
