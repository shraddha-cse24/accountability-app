const express = require("express");
const cors = require("cors");
require("./cronJobs");
const db = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const goalRoutes = require("./routes/goalRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads")
);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/checkins", checkinRoutes);
app.use(
  "/api/invitations",
  invitationRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

const PORT = 5000;

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

testDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});