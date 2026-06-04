const db = require("../config/db");

const createCheckin = async (req, res) => {
    try {
        const { status, note } = req.body;
        const [existingCheckin] = await db.query(
            `SELECT * FROM checkins
   WHERE goal_id = ?
   AND checkin_date = CURDATE()`,
            [req.params.goalId]
        );

        if (existingCheckin.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Today's check-in already exists",
            });
        }

        const [result] = await db.query(
            `INSERT INTO checkins
(goal_id, status, note, checkin_date)
VALUES (?, ?, ?, CURDATE())`,
            [
                req.params.goalId,
                status,
                note
            ]
        );

        res.status(201).json({
            success: true,
            checkinId: result.insertId,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getGoalStats = async (req, res) => {
  try {

    const [completed] = await db.query(
      `SELECT COUNT(*) as total
       FROM checkins
       WHERE goal_id = ?
       AND status = 'COMPLETED'`,
      [req.params.goalId]
    );

    const [all] = await db.query(
      `SELECT COUNT(*) as total
       FROM checkins
       WHERE goal_id = ?`,
      [req.params.goalId]
    );

    const totalCompleted = completed[0].total;
    const totalCheckins = all[0].total;

    const consistency =
      totalCheckins === 0
        ? 0
        : ((totalCompleted / totalCheckins) * 100).toFixed(2);

    res.json({
      success: true,
      totalCompleted,
      totalCheckins,
      consistency,
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
    createCheckin,
    getGoalStats,
};