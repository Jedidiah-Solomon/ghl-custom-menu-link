import express from "express";
import {
  getCustomMenuById,
  getCustomMenus,
  createCustomMenu,
  updateCustomMenu,
  deleteCustomMenu,
} from "../controllers/customMenuController.js";

const router = express.Router();

router.get("/:customMenuId", getCustomMenuById);
router.get("/", getCustomMenus);
router.post("/", createCustomMenu);
router.put("/:customMenuId", updateCustomMenu);
router.delete("/:customMenuId", deleteCustomMenu);

export default router;
