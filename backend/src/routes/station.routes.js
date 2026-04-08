import express from "express";
import StationController from "../controllers/station.controller.js";

const router = express.Router();
// to get all stations
router.get("/", StationController.getAllStations.bind(StationController));
// to get a station by id
router.get("/:id", StationController.getStationById.bind(StationController));
// to create a station
router.post("/", StationController.createStation.bind(StationController));
// to update a station
router.put("/:id", StationController.updateStation.bind(StationController));
// to delete a station
router.delete("/:id", StationController.deleteStation.bind(StationController));

export default router;
