import express from "express";
const router = express.Router();
import ScheduleController from "../controllers/schedule.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

// to create a schedule (admin only)
router.post("/", requireAdmin, ScheduleController.create.bind(ScheduleController));
// to get all schedules for a specific date (optional query param)
router.get("/all", ScheduleController.getAll.bind(ScheduleController));
// to get schedules by route
router.get("/route/:routeId", ScheduleController.getByRoute.bind(ScheduleController));
// to update a schedule (admin only)
router.put("/:id", requireAdmin, ScheduleController.update.bind(ScheduleController));
// to delete a schedule (admin only)
router.delete("/:id", requireAdmin, ScheduleController.delete.bind(ScheduleController));

export default router;

