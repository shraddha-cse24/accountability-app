const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const normalizedEmail =
            email.trim().toLowerCase();

        if (
            !name?.trim() ||
            !email?.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required",
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Name must be at least 2 characters",
            });
        }

        if (name.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message:
                    "Name too long",
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                email.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid email address",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            [name.trim(), normalizedEmail, hashedPassword]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                email: normalizedEmail,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            !email?.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }
        const normalizedEmail =
            email.trim().toLowerCase();

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            token,
            userId: user.id,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email FROM users WHERE id = ?",
            [req.user.id]
        );

        res.json({
            success: true,
            user: users[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getProfile = async (req, res) => {
    try {

        const [users] = await db.query(
            `SELECT id, name, email
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        const [stats] = await db.query(
            `SELECT
                COUNT(*) AS totalGoals,

                SUM(
                    CASE
                    WHEN status = 'COMPLETED'
                    THEN 1
                    ELSE 0
                    END
                ) AS completedGoals,

                SUM(
                    CASE
                    WHEN status = 'MISSED'
                    THEN 1
                    ELSE 0
                    END
                ) AS missedGoals,

                SUM(
                    CASE
                    WHEN verified_by IS NOT NULL
                    THEN 1
                    ELSE 0
                    END
                ) AS verifiedGoals

             FROM goals
             WHERE user_id = ?`,
            [req.user.id]
        );

        const [groups] = await db.query(
            `SELECT COUNT(*) AS groupsJoined
             FROM group_members
             WHERE user_id = ?`,
            [req.user.id]
        );

        res.json({
            success: true,
            user: users[0],
            stats: stats[0],
            groupsJoined:
                groups[0].groupsJoined,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateProfile = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (name.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message: "Name too long",
            });
        }

        await db.query(
            `UPDATE users
             SET name = ?
             WHERE id = ?`,
            [name.trim(), req.user.id]
        );

        res.json({
            success: true,
            message: "Profile updated",
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
    registerUser,
    loginUser,
    getMe,
    getProfile,
    updateProfile,
};