const Product = require("../../models/products");

const getProductShareLink = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Determine the frontend URL
        // Priority: Environment Variable -> Render Public URL -> Fallback Hardcoded
        let frontendBaseUrl = process.env.CLIENT_URL;

        if (!frontendBaseUrl) {
            // If CLIENT_URL is not set, try to use the Render URL or fallback
            frontendBaseUrl = "https://gadgetgrid-3hz0.onrender.com";
        }

        // Ensure no trailing slash
        if (frontendBaseUrl.endsWith('/')) {
            frontendBaseUrl = frontendBaseUrl.slice(0, -1);
        }

        // Construct the actual deep link
        const targetUrl = `${frontendBaseUrl}/shop/listing?product=${productId}`;

        // Use the first image if it's an array, or the image string itself
        const imageUrl = product.image;
        const title = product.title;
        const description = product.description ? product.description.substring(0, 150) + "..." : "Check out this product on Gadgets Grid";
        const price = product.salePrice > 0 ? product.salePrice : product.price;

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Gadgets Grid</title>
    
    <!-- Redirect Fallback -->
    <meta http-equiv="refresh" content="0;url=${targetUrl}">
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="Price: ₦${price.toLocaleString()} - ${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${targetUrl}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Gadgets Grid">
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="Price: ₦${price.toLocaleString()} - ${description}">
    <meta name="twitter:image" content="${imageUrl}">

    <style>
        body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9f9f9; }
        .redirect-msg { text-align: center; color: #555; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #ff8c42; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="redirect-msg">
        <div class="loader"></div>
        <p>Redirecting you to Gadgets Grid...</p>
        <p><a href="${targetUrl}">Click here if you are not redirected</a></p>
    </div>
    <script>
        // Immediate redirect
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
