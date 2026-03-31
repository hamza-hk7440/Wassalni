import express from "express";
const router = express.Router();
import RouteController from "../controllers/transport.controller";
//to create a transport
router.post("/", RouteController.createTransport);
//to get all transports
router.get("/", RouteController.getAllTransports);
//to get a transport by id
router.get("/:id", RouteController.getTransportById);
//to update a transport
router.put("/:id", RouteController.updateTransport);
//to delete a transport
router.delete("/:id", RouteController.deleteTransport);

export default router;
