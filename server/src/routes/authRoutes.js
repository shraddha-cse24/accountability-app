const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;