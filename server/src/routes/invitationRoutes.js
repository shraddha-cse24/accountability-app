const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    sendInvitation,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
} = require("../controllers/invitationController");

const router = express.Router();

router.post(
    "/:groupId",
    protect,
    sendInvitation
);

router.get(
    "/my",
    protect,
    getMyInvitations
);

router.put(
    "/:invitationId/accept",
    protect,
    acceptInvitation
);

router.put(
    "/:invitationId/reject",
    protect,
    rejectInvitation
);

module.exports = router;