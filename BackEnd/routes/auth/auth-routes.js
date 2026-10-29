const express = require("express");
const {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  authMiddleware,
  
  
  checkAuth,
} = require("../../controllers/auth/auth-controller");


const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth",
   authMiddleware,
    checkAuth);

module.exports = router;
