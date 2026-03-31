import express from "express";
const router = express.Router();
import RouteController from "../controllers/route.controller.js";
//to create a route
router.post("/", RouteController.create);
//to get all routes
router.get("/", RouteController.getAll);
//to get a route by id
router.get("/:id", RouteController.getById);
//to delete a route
router.delete("/:id", RouteController.delete);

export default router;
