const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createGroup,
  addMember,
  getMyGroups,
  getGroupDetails,
  removeMember,
  deleteGroup,
  leaveGroup,
  getGroupHistory,
  clearGroupHistory,
} = require("../controllers/groupController");

const router = express.Router();

router.get(
  "/my-groups",
  protect,
  getMyGroups
);

router.post(
  "/",
  protect,
  createGroup
);

router.get(
  "/:groupId/history",
  protect,
  getGroupHistory
);

router.delete(
  "/:groupId/history",
  protect,
  clearGroupHistory
);

router.post(
  "/:groupId/add-member",
  protect,
  addMember
);

router.delete(
  "/:groupId/member/:memberId",
  protect,
  removeMember
);

router.delete(
  "/:groupId",
  protect,
  deleteGroup
);

router.get(
  "/:groupId",
  protect,
  getGroupDetails
);

router.delete(
  "/:groupId/leave",
  protect,
  leaveGroup
);

module.exports = router;