import express from "express";
import { simulatePayment } from "../controllers/webhooksimulatorController.js";

const router = express.Router();

router.post("/simulatewebhook", simulatePayment);

export default router;
