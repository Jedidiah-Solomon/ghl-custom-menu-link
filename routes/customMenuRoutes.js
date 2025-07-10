import express from "express";
import {
  getCustomMenuById,
  createCustomMenu,
  updateCustomMenu,
  deleteCustomMenu,
} from "../controllers/customMenuController.js";

const router = express.Router();

router.get("/:customMenuId", getCustomMenuById);
router.post("/", createCustomMenu);
router.put("/:customMenuId", updateCustomMenu);
router.delete("/:customMenuId", deleteCustomMenu);

export default router;
