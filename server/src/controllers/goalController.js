const db = require("../config/db");

const createGoal = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Goal title is required",
            });
        }

        if (title.trim().length > 255) {
            return res.status(400).json({
                success: false,
                message:
                    "Goal title too long",
            });
        }

        const [member] = await db.query(
            `SELECT * FROM group_members
   WHERE group_id = ?
   AND user_id = ?`,
            [req.params.groupId, req.user.id]
        );

        if (member.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }

        const [result] = await db.query(
            `INSERT INTO goals
      (user_id, group_id, title, goal_date)
      VALUES (?, ?, ?, ?)`,
            [
                req.user.id,
                req.params.groupId,
                title,
                new Date()
                    .toLocaleDateString(
                        "en-CA",
                        {
                            timeZone:
                                "Asia/Kolkata"
                        }
                    )
            ]
        );

        res.status(201).json({
            success: true,
            goalId: result.insertId,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getGroupGoals = async (req, res) => {
    try {

        const [goals] = await db.query(
            `SELECT
        goals.*,
        users.name as user_name
      FROM goals
      JOIN users
      ON goals.user_id = users.id
      WHERE goals.group_id = ?`,
            [req.params.groupId]
        );

        res.json({
            success: true,
            goals,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateGoalStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const [goal] = await db.query(
            "SELECT * FROM goals WHERE id = ?",
            [req.params.goalId]
        );

        if (goal.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        if (goal[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message:
                    "You can update only your own goals",
            });
        }

        await db.query(
            `UPDATE goals
             SET status = ?
             WHERE id = ?`,
            [status, req.params.goalId]
        );

        res.json({
            success: true,
            message: "Goal status updated",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const verifyGoal = async (req, res) => {
    try {
        const [goal] = await db.query(
            "SELECT * FROM goals WHERE id = ?",
            [req.params.goalId]
        );

        if (goal.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        if (goal[0].user_id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot verify your own goal",
            });
        }

        if (goal[0].verified_by) {
            return res.status(400).json({
                success: false,
                message:
                    "Goal already verified",
            });
        }

        const [member] = await db.query(
            `
    SELECT *
    FROM group_members
    WHERE group_id = ?
    AND user_id = ?
    `,
            [
                goal[0].group_id,
                req.user.id
            ]
        );

        if (member.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not a member of this group",
            });
        }

        if (!goal[0].proof_url) {
            return res.status(400).json({
                success: false,
                message:
                    "Proof required before verification",
            });
        }

        await db.query(
            `
    UPDATE goals
    SET
        verified_by = ?,
        verified_at = NOW(),
        status = 'VERIFIED'
    WHERE id = ?
    `,
            [
                req.user.id,
                req.params.goalId
            ]
        );

        await db.query(
            `
    INSERT INTO notifications
    (user_id, message)
    VALUES (?, ?)
    `,
            [
                goal[0].user_id,
                `Your goal "${goal[0].title}" was verified 🎉`
            ]
        );

        res.json({
            success: true,
            message: "Goal verified",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const uploadProof = async (req, res) => {
    try {

        const [goal] = await db.query(
            "SELECT * FROM goals WHERE id = ?",
            [req.params.goalId]
        );

        if (goal.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }


        if (goal[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message:
                    "You can upload proof only for your own goals",
            });
        }

        if (goal[0].verified_by) {
            return res.status(400).json({
                success: false,
                message:
                    "Verified goal cannot be modified",
            });
        }

        if (goal[0].proof_url) {
            return res.status(400).json({
                success: false,
                message:
                    "Proof already uploaded",
            });
        }

        if (goal[0].status !== "COMPLETED") {
            return res.status(400).json({
                success: false,
                message:
                    "Complete the goal first",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const proofUrl =
            `/uploads/${req.file.filename}`;

        await db.query(
            `UPDATE goals
             SET proof_url = ?
             WHERE id = ?`,
            [
                proofUrl,
                req.params.goalId,
            ]
        );

        res.json({
            success: true,
            proofUrl,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyStats = async (req, res) => {
    try {

        const [total] = await db.query(
            "SELECT COUNT(*) as count FROM goals WHERE user_id = ?",
            [req.user.id]
        );

        const [completed] = await db.query(
            `SELECT COUNT(*) as count
             FROM goals
             WHERE user_id = ?
             AND status = 'COMPLETED'`,
            [req.user.id]
        );

        const [missed] = await db.query(
            `SELECT COUNT(*) as count
             FROM goals
             WHERE user_id = ?
             AND status = 'MISSED'`,
            [req.user.id]
        );

        const [verified] = await db.query(
            `SELECT COUNT(*) as count
             FROM goals
             WHERE user_id = ?
             AND verified_by IS NOT NULL`,
            [req.user.id]
        );

        res.json({
            success: true,
            totalGoals: total[0].count,
            completedGoals: completed[0].count,
            missedGoals: missed[0].count,
            verifiedGoals: verified[0].count,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMyStreak = async (req, res) => {
    try {

        const [goals] = await db.query(
            `
    SELECT DISTINCT
        DATE_FORMAT(
            verified_at,
            '%Y-%m-%d'
        ) AS verified_date
    FROM goals
    WHERE user_id = ?
    AND verified_at IS NOT NULL
    ORDER BY verified_date DESC
    `,
            [req.user.id]
        );

        const dates = goals.map(
            (goal) => goal.verified_date
        );

        let currentStreak = 0;

        let checkDate = new Date();

        const today =
            checkDate.toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata",
                }
            );

        if (!dates.includes(today)) {

            checkDate.setDate(
                checkDate.getDate() - 1
            );

        }

        while (true) {

            const dateString =
                checkDate.toLocaleDateString(
                    "en-CA",
                    {
                        timeZone: "Asia/Kolkata",
                    }
                );


            if (dates.includes(dateString)) {

                currentStreak++;

                checkDate.setDate(
                    checkDate.getDate() - 1
                );

            } else {
                break;
            }
        }

        res.json({
            success: true,
            currentStreak,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const deleteGoal = async (req, res) => {
    try {

        const [goal] = await db.query(
            "SELECT * FROM goals WHERE id = ?",
            [req.params.goalId]
        );

        if (goal.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        if (goal[0].verified_by) {
            return res.status(400).json({
                success: false,
                message:
                    "Verified goals cannot be deleted",
            });
        }

        if (goal[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own goals",
            });
        }

        await db.query(
            "DELETE FROM goals WHERE id = ?",
            [req.params.goalId]
        );

        res.json({
            success: true,
            message: "Goal deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const getTodayProgress = async (req, res) => {

    try {

        const [todayGoals] =
            await db.query(
                `
                SELECT COUNT(*) as count
                FROM goals
                WHERE user_id = ?
                AND goal_date = CURDATE()
                `,
                [req.user.id]
            );

        const [completedToday] =
            await db.query(
                `
                SELECT COUNT(*) as count
                FROM goals
                WHERE user_id = ?
                AND goal_date = CURDATE()
                AND verified_by IS NOT NULL
                `,
                [req.user.id]
            );

        const total =
            todayGoals[0].count;

        const completed =
            completedToday[0].count;

        const remaining =
            total - completed;

        res.json({
            success: true,
            total,
            completed,
            remaining,
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
    createGoal,
    getGroupGoals,
    updateGoalStatus,
    verifyGoal,
    getMyStats,
    getMyStreak,
    uploadProof,
    deleteGoal,
    getTodayProgress,
};