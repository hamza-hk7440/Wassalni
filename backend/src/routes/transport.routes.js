
import express from "express";
const router = express.Router();

import TransportController from "../controllers/transport.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

// Public or standard routes
router.get("/", TransportController.getAll);
router.get("/:id", TransportController.getById);

// Admin only routes for modification
router.post("/", requireAdmin, TransportController.create);
router.put("/:id", requireAdmin, TransportController.update);
router.delete("/:id", requireAdmin, TransportController.delete);

export default router;
