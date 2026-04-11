import express from "express";
import RouteController from "../controllers/route.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", RouteController.getAll.bind(RouteController));
router.get("/:id", RouteController.getById.bind(RouteController));

// Admin only routes for modification
router.post("/", requireAdmin, RouteController.create.bind(RouteController));
router.put("/:id", requireAdmin, RouteController.update.bind(RouteController));
router.delete("/:id", requireAdmin, RouteController.delete.bind(RouteController));

export default router;
