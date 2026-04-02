import express from "express";
const router = express.Router();

import StaionController from "../controllers/stations.controller.js";
//to get all stations
router.get("/", StaionController.getAllStations);
//to  get a station by id
router.get("/:id", StaionController.getStationById);
//to create a station
router.post("/", StaionController.createStation);
//to update a station
router.put("/:id", StaionController.updateStation);
//to delete a station
router.delete("/:id", StaionController.deleteStation);

export default router;
