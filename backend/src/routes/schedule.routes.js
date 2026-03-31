import express from "express";
const router = express.Router();
import ScheduleController from "../controllers/schedule.controller.js";
// to create a schedule
router.post("/", ScheduleController.create);
// to get all schedules for a specific date (optional query param)
router.get("/all", ScheduleController.getAll);
// to delete a schedule
router.delete("/:id", ScheduleController.delete);
// to get schedules by route
router.get(
  "/route/:routeId",
  ScheduleController.getByRoute.bind(ScheduleController),
);
// to update a schedule
router.put("/:id", ScheduleController.update.bind(ScheduleController));
export default router;
