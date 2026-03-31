import express from "express";
import TransportController from "../controllers/transport.controller.js";

const router = express.Router();

// to create a transport
router.post("/", TransportController.create.bind(TransportController));
// to get all transports
router.get("/", TransportController.getAll.bind(TransportController));
// to get a transport by id
router.get("/:id", TransportController.getById.bind(TransportController));
// to update a transport
router.put("/:id", TransportController.update.bind(TransportController));
// to delete a transport
router.delete("/:id", TransportController.delete.bind(TransportController));

export default router;
