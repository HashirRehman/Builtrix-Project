import express from "express";
import {
  getMetadata,
  getMonthlyConsumption,
  getDailyConsumption,
  getFifteenMinConsumption,
  getEnergySourceBreakdown,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/metadata", getMetadata);

router.get("/energy/monthly", getMonthlyConsumption);

router.get("/energy/daily", getDailyConsumption);

router.get("/energy/15min", getFifteenMinConsumption);

router.get("/energy/sources", getEnergySourceBreakdown);

export default router;
