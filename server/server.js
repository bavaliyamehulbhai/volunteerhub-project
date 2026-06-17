require("dotenv").config();

const express = require("express"); // Restart trigger
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoSanitizer = require("./middleware/mongoSanitizer");
const xssSanitizer = require("./middleware/xssSanitizer");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

// Apply security headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading Cloudinary images cross-origin
}));

// Configure CORS with credentials support
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Anti-NoSQL Query Injection and XSS mitigation
app.use(mongoSanitizer);
app.use(xssSanitizer);

// Rate Limiting for Auth Endpoints to prevent brute-force attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 security-sensitive requests per window
  message: {
    message: "Too many attempts from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to security endpoints
app.use("/api/auth/login", authRateLimiter);
app.use("/api/auth/register", authRateLimiter);
app.use("/api/auth/verify-mfa", authRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("VolunteerHub API Running");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

// Force nodemon restart: 1