import express from "express";
import StationController from "../controllers/station.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();
// to get all stations (public)
router.get("/", StationController.getAllStations.bind(StationController));
// to get a station by id (public)
router.get("/:id", StationController.getStationById.bind(StationController));
// to create a station (admin only)
router.post("/", requireAdmin, StationController.createStation.bind(StationController));
// to update a station (admin only)
router.put("/:id", requireAdmin, StationController.updateStation.bind(StationController));
// to delete a station (admin only)
router.delete("/:id", requireAdmin, StationController.deleteStation.bind(StationController));

export default router;

