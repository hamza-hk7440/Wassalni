import express from "express";
const router = express.Router();

import RouteController from "../controllers/route.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

// Public or standard routes
router.get("/", RouteController.getAll);
router.get("/:id", RouteController.getById);

// Admin only routes for modification
router.post("/", requireAdmin, RouteController.create);
router.delete("/:id", requireAdmin, RouteController.delete);

export default router;
