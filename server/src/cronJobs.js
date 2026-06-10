const cron = require("node-cron");
const db = require("./config/db");


cron.schedule(
    "0 0 * * *",
    async () => {

        try {

            console.log(
                "Running daily goal cleanup..."
            );

            await db.query(`
                UPDATE goals
                SET status = 'MISSED'
                WHERE verified_by IS NULL
                AND goal_date < CURDATE()
            `);

            await db.query(`
    DELETE FROM notifications
    WHERE created_at < DATE_SUB(
        NOW(),
        INTERVAL 3 DAY
    )
`);

            console.log(
                "Cleanup completed"
            );

        } catch (error) {

            console.error(
                "Cron error:",
                error
            );

        }

    },
    {
        timezone: "Asia/Kolkata"
    }
);