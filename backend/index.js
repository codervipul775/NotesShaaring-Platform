const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();
const passport = require("passport");
const connectDB = require("./config/db");
const initGooglePassport = require("./config/passport");
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const existing = await Admin.findOne({ username: 'admin' });
  if (!existing) {
    const hashed = await bcrypt.hash('120290', 10); 
    await Admin.create({ username: 'admin', password: hashed });
    console.log('Default admin created');
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://notes-shaaring-platform.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(" Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
};

connectDB()
  .then(() => {
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    initGooglePassport();
    app.use(passport.initialize());

    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/notes", require("./routes/noteRoutes"));
    app.use("/api/reviews", require("./routes/reviewRoutes"));
    app.use("/api/doubts", require("./routes/doubtRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));

    app.get("/", (req, res) => {
      res.json({
        message: "Welcome to Notes Sharing Platform API",
        version: "v1.0.0",
        status: "OK",
        frontend: process.env.FRONTEND_URL || "http://localhost:5173",
      });
    });

    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.use((err, req, res, next) => {
      console.error("Server Error:", err.stack);
      res.status(500).json({ message: "Internal Server Error" });
    });

    seedAdmin();
    app.listen(PORT, () => {
      console.log("MongoDB connected");
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  });
