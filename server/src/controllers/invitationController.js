const db = require("../config/db");

const sendInvitation = async (req, res) => {
    try {

        const { email } = req.body;
        const groupId = req.params.groupId;

        const [ownerCheck] = await db.query(
            `SELECT * FROM group_members
     WHERE group_id = ?
     AND user_id = ?
     AND role = 'owner'`,
            [groupId, req.user.id]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "Only owner can send invitations",
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const receiver = users[0];

        if (receiver.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot invite yourself",
            });
        }

        const [member] = await db.query(
            `SELECT * FROM group_members
             WHERE group_id = ?
             AND user_id = ?`,
            [groupId, receiver.id]
        );

        if (member.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "User is already a member",
            });
        }

        const [existing] = await db.query(
            `SELECT * FROM group_invitations
             WHERE group_id = ?
             AND receiver_id = ?
             AND status = 'PENDING'`,
            [groupId, receiver.id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invitation already sent",
            });
        }

        await db.query(
            `INSERT INTO group_invitations
            (group_id, sender_id, receiver_id)
            VALUES (?, ?, ?)`,
            [
                groupId,
                req.user.id,
                receiver.id,
            ]
        );

        res.json({
            success: true,
            message: "Invitation sent",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyInvitations = async (req, res) => {
    try {

        const [invitations] = await db.query(
            `SELECT
                group_invitations.*,
                groups.name AS group_name,
                users.name AS sender_name
             FROM group_invitations
             JOIN groups
             ON groups.id = group_invitations.group_id
             JOIN users
             ON users.id = group_invitations.sender_id
             WHERE group_invitations.receiver_id = ?
             AND group_invitations.status = 'PENDING'`,
            [req.user.id]
        );

        res.json({
            success: true,
            invitations,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const acceptInvitation = async (req, res) => {
    try {

        const invitationId = req.params.invitationId;

        const [invitation] = await db.query(
            `SELECT * FROM group_invitations
             WHERE id = ?`,
            [invitationId]
        );

        if (invitation.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found",
            });
        }

        const invite = invitation[0];

        if (invite.receiver_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await db.query(
            `UPDATE group_invitations
             SET status = 'ACCEPTED'
             WHERE id = ?`,
            [invitationId]
        );

        await db.query(
            `INSERT INTO group_members
            (group_id, user_id)
            VALUES (?, ?)`,
            [
                invite.group_id,
                req.user.id,
            ]
        );

        res.json({
            success: true,
            message: "Invitation accepted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const rejectInvitation = async (req, res) => {
    try {

        await db.query(
            `UPDATE group_invitations
             SET status = 'REJECTED'
             WHERE id = ?`,
            [req.params.invitationId]
        );

        res.json({
            success: true,
            message: "Invitation rejected",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    sendInvitation,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
};