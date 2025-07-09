import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const payloads = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/payload.json"), "utf8")
);

const simulatePayment = async (req, res) => {
  const { name, cardNumber, cvv, otp } = req.body;

  if (!name || !cardNumber || !cvv || !otp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let payloadToSend;

  //[cardNumbers we will use: 8877,0000,1234,]

  switch (cardNumber.slice(-4)) {
    case "8877":
      payloadToSend = payloads.find((p) => p.event === "charge.success");
      break;
    case "0000":
      payloadToSend = payloads.find((p) => p.event === "transfer.success");
      break;
    case "1234":
      payloadToSend = payloads.find((p) => p.event === "transfer.failed");
      break;
    default:
      return res
        .status(400)
        .json({ error: "Card not recognized for simulation" });
  }

  try {
    const { data: webhookResponse } = await axios.post(
      process.env.WEBHOOK_URL,
      payloadToSend,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(200).json({
      message: `Simulated ${payloadToSend.event}`,
      webhookResponse,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to send webhook",
      details: error.response?.data || error.message,
    });
  }
};

export { simulatePayment };
