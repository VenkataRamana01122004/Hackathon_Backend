const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

require("./models/Manager");
require("./models/Employee");
require("./models/Candidate");
require("./models/Interview");
require("./models/Assignment");
require("./models/Question");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes");

const candidateRoutes = require("./routes/candidateRoutes");

const interviewRoutes = require("./routes/interviewRoutes");



// app.use("/api/interview", candidateRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/candidate", candidateRoutes);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Interview Bot Backend Running 🚀"
    });
});

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log("✅ MySQL Connected Successfully.");

        // Sync models with database
        await sequelize.sync({ alter: true });
        console.log("✅ Database Synced.");

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to connect to the database:");
        console.error(error.message);
        process.exit(1);
    }
}


startServer();