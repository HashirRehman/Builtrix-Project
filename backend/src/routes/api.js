import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import {
  getMetadata,
  getMonthlyConsumption,
  getDailyConsumption,
  getFifteenMinConsumption,
  getEnergySourceBreakdown,
  exportData,
} from "../controllers/dataController.js";

const router = express.Router();

router.use(optionalAuth);

router.get("/metadata", getMetadata);

router.get("/energy/monthly", getMonthlyConsumption);

router.get("/energy/daily", getDailyConsumption);

router.get("/energy/15min", getFifteenMinConsumption);

router.get("/energy/sources", getEnergySourceBreakdown);

router.get("/export", exportData);

export default router;
