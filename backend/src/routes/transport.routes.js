import express from "express";
import TransportController from "../controllers/transport.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", TransportController.getAll.bind(TransportController));
router.get("/:id", TransportController.getById.bind(TransportController));

// Admin only routes for modification
router.post("/", requireAdmin, TransportController.create.bind(TransportController));
router.put("/:id", requireAdmin, TransportController.update.bind(TransportController));
router.delete("/:id", requireAdmin, TransportController.delete.bind(TransportController));

export default router;

