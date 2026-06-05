const express = require("express");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const { createGoal,getGroupGoals, updateGoalStatus, verifyGoal, getMyStats, getMyStreak, uploadProof, deleteGoal,} = require("../controllers/goalController");

const router = express.Router();
router.get(
  "/group/:groupId",
  protect,
  getGroupGoals,
);

router.post("/:groupId", protect, createGoal);
router.get(
  "/stats/me",
  protect,
  getMyStats
);

router.get(
  "/streak/me",
  protect,
  getMyStreak
);

router.put(
  "/:goalId/status",
  protect,
  updateGoalStatus
);

router.put(
  "/:goalId/verify",
  protect,
  verifyGoal
);

router.delete(
  "/:goalId",
  protect,
  deleteGoal
);

router.post(
  "/:goalId/proof",
  protect,
  upload.single("proof"),
  uploadProof
);


module.exports = router;