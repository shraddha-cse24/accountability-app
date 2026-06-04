const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createGroup,
  addMember,
  getMyGroups,
  getGroupDetails,
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

router.post(
  "/:groupId/add-member",
  protect,
  addMember
);

router.get(
  "/:groupId",
  protect,
  getGroupDetails
);

module.exports = router;