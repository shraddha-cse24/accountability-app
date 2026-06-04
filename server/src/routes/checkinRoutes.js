const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createCheckin,
  getGoalStats,
} = require("../controllers/checkinController");

const router = express.Router();

router.post(
  "/:goalId",
  protect,
  createCheckin
);

router.get(
  "/stats/:goalId",
  protect,
  getGoalStats
);

module.exports = router;