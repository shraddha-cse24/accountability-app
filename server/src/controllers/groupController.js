const db = require("../config/db");

const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Group name too long",
            });
        }

        const [result] = await db.query(
            `INSERT INTO groups (name, description, created_by)
   VALUES (?, ?, ?)`,
            [name.trim(), description?.trim() || null, req.user.id]
        );
        await db.query(
            `INSERT INTO group_members
   (group_id, user_id, role)
   VALUES (?, ?, ?)`,
            [result.insertId, req.user.id, "owner"]
        );

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            groupId: result.insertId,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const addMember = async (req, res) => {
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
                message: "Only owner can add members",
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

        const userToAdd = users[0];

        const [existingMember] = await db.query(
            `SELECT * FROM group_members
   WHERE group_id = ?
   AND user_id = ?`,
            [groupId, userToAdd.id]
        );

        if (existingMember.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already in group",
            });
        }

        await db.query(
            `INSERT INTO group_members
   (group_id, user_id)
   VALUES (?, ?)`,
            [groupId, userToAdd.id]
        );

        res.json({
            success: true,
            message: "Member added successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyGroups = async (req, res) => {
    try {

        const [groups] = await db.query(
            `
  SELECT
    groups.*,
    COUNT(DISTINCT group_members_all.user_id) AS memberCount
  FROM groups

  JOIN group_members
    ON groups.id = group_members.group_id

  LEFT JOIN group_members AS group_members_all
    ON groups.id = group_members_all.group_id

  WHERE group_members.user_id = ?

  GROUP BY groups.id
  `,
            [req.user.id]
        );

        res.json({
            success: true,
            groups,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getGroupDetails = async (req, res) => {
    try {
        await db.query(`
DELETE FROM notifications
WHERE is_read = TRUE
AND created_at < NOW() - INTERVAL 1 DAY
`);

        await db.query(`
UPDATE goals
SET status = 'MISSED'
WHERE status = 'PENDING'
AND goal_date < CURDATE()
`);
        const groupId = req.params.groupId;

        const [membership] =
            await db.query(
                `
        SELECT role
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
        `,
                [
                    groupId,
                    req.user.id
                ]
            );

        if (!membership[0]) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });
        }

        const [group] = await db.query(
            "SELECT * FROM groups WHERE id = ?",
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const [members] = await db.query(
            `SELECT
    users.id,
    users.name,
    users.email,
    group_members.role
   FROM group_members
   JOIN users
   ON users.id = group_members.user_id
   WHERE group_members.group_id = ?`,
            [groupId]
        );

        const [leaderboard] = await db.query(
            `SELECT
      users.id,
      users.name,
      COUNT(goals.id) AS verified_count
   FROM group_members
   JOIN users
      ON users.id = group_members.user_id
   LEFT JOIN goals
      ON goals.user_id = users.id
      AND goals.group_id = group_members.group_id
      AND goals.verified_by IS NOT NULL
   WHERE group_members.group_id = ?
   GROUP BY users.id, users.name
   ORDER BY verified_count DESC`,
            [groupId]
        );

        const [goals] = await db.query(
            `SELECT goals.*, users.name as user_name
   FROM goals
   JOIN users
   ON users.id = goals.user_id
   WHERE goals.group_id = ?
   ORDER BY goal_date DESC`,
            [groupId]
        );

        res.json({
            success: true,
            group: group[0],
            members,
            goals,
            leaderboard,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const removeMember = async (req, res) => {
    try {

        const groupId = req.params.groupId;
        const memberId = req.params.memberId;

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
                message: "Only owner can remove members",
            });
        }

        await db.query(
            `DELETE FROM group_members
             WHERE group_id = ?
             AND user_id = ?`,
            [groupId, memberId]
        );

        res.json({
            success: true,
            message: "Member removed",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const deleteGroup = async (req, res) => {
    try {

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
                    "Only owner can delete group",
            });
        }

        await db.query(
            "DELETE FROM goals WHERE group_id = ?",
            [groupId]
        );

        await db.query(
            "DELETE FROM group_members WHERE group_id = ?",
            [groupId]
        );

        await db.query(
            "DELETE FROM group_invitations WHERE group_id = ?",
            [groupId]
        );

        await db.query(
            "DELETE FROM groups WHERE id = ?",
            [groupId]
        );

        res.json({
            success: true,
            message: "Group deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const leaveGroup = async (req, res) => {
    try {

        const groupId = req.params.groupId;

        const [ownerCheck] = await db.query(
            `SELECT * FROM group_members
             WHERE group_id = ?
             AND user_id = ?
             AND role = 'owner'`,
            [groupId, req.user.id]
        );

        if (ownerCheck.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Owner cannot leave group. Delete it instead."
            });
        }

        await db.query(
            `DELETE FROM group_members
             WHERE group_id = ?
             AND user_id = ?`,
            [groupId, req.user.id]
        );

        res.json({
            success: true,
            message: "You left the group",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getGroupHistory = async (req, res) => {
    try {

        const groupId = req.params.groupId;

        const [membership] =
            await db.query(
                `
        SELECT role
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
        `,
                [
                    groupId,
                    req.user.id
                ]
            );

        if (!membership[0]) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const days = req.query.days;

        if (
            days &&
            days !== "all" &&
            (
                isNaN(Number(days)) ||
                Number(days) < 1
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid days value",
            });
        }

        let query = `
            SELECT goals.*, users.name as user_name
            FROM goals
            JOIN users
            ON users.id = goals.user_id
            WHERE goals.group_id = ?
            AND goal_date < CURDATE()
        `;

        if (days && days !== "all") {
            query += `
                AND goal_date >= DATE_SUB(
                    CURDATE(),
                    INTERVAL ? DAY
                )
            `;
        }

        query += `
            ORDER BY goal_date DESC
        `;

        const [history] =
            days && days !== "all"
                ? await db.query(
                    query,
                    [groupId, Number(days)]
                )
                : await db.query(
                    query,
                    [groupId]
                );

        res.json({
            success: true,
            history,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const clearGroupHistory = async (req, res) => {
    try {

        const groupId = req.params.groupId;

        const [ownerCheck] = await db.query(
            `SELECT *
             FROM group_members
             WHERE group_id = ?
             AND user_id = ?
             AND role = 'owner'`,
            [groupId, req.user.id]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "Only owner can clear history",
            });
        }

        await db.query(
            `DELETE FROM goals
             WHERE group_id = ?
             AND goal_date < CURDATE()`,
            [groupId]
        );

        res.json({
            success: true,
            message:
                "History cleared successfully",
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
    createGroup,
    addMember,
    getMyGroups,
    getGroupDetails,
    removeMember,
    deleteGroup,
    leaveGroup,
    getGroupHistory,
    clearGroupHistory,
};