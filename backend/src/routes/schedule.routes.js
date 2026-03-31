import express from "express";
const router = express.Router();
import ScheduleController from "../controllers/schedule.controller.js";

router.post("/", ScheduleController.create);
router.get("/", ScheduleController.getAll);
router.delete("/:id", ScheduleController.delete);

export default router;
