import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import initializeDatabase from "./db/init.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }

  // Routes
  app.use("/auth", authRoutes);
  app.use("/api", apiRoutes);

  // Health check
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      message: "Builtrix API is running",
    });
  });

  // API documentation
  app.get("/docs", (req, res) => {
    res.json({
      title: "Builtrix Energy Dashboard API",
      version: "1.0.0",
      endpoints: {
        auth: {
          "POST /auth/login": "Login with email/password",
          "POST /auth/register": "Register new user",
          "GET /auth/profile": "Get user profile (requires authentication)",
          "POST /auth/logout": "Logout user (requires authentication)",
        },
        data: {
          "GET /api/metadata": "Get building metadata with geolocation",
          "GET /api/energy/monthly":
            "Get monthly energy consumption (params: year, building)",
          "GET /api/energy/daily":
            "Get daily energy consumption (params: year, month, building)",
          "GET /api/energy/15min":
            "Get 15-minute energy consumption (params: year, month, day, building)",
          "GET /api/energy/sources":
            "Get energy source breakdown (params: year, month, day)",
          "GET /api/export":
            "Export data for download (params: type=[metadata|monthly|daily|fifteenmin], year, month, day, building)",
        },
      },
      authentication: {
        type: "Bearer JWT",
        header: "Authorization: Bearer <token>",
        default_user: {
          email: "admin@builtrix.tech",
          password: "admin123"
        }
      },
      example_requests: {
        login: "POST /auth/login with {email, password}",
        monthly: "GET /api/energy/monthly?year=2021",
        daily: "GET /api/energy/daily?year=2021&month=1",
        specific_building: "GET /api/energy/monthly?building=CPE10001",
      },
    });
  });

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}`);
    console.log(`API documentation at http://localhost:${PORT}/docs`);
  });
}

startServer();
