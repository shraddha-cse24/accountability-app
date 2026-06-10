const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    getNotifications,
    markNotificationsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get(
    "/",
    protect,
    getNotifications
);
router.put(
  "/read",
  protect,
  markNotificationsRead
);


module.exports = router;