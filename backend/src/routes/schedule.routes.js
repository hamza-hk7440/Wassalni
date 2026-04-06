import express from "express";
const router = express.Router();
import ScheduleController from "../controllers/schedule.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";


router.post("/", requireAdmin, ScheduleController.create);
router.get("/", ScheduleController.getAll);
router.delete("/:id", requireAdmin, ScheduleController.delete);

export default router;
