import express from "express";
import RouteController from "../controllers/route.controller.js";

const router = express.Router();
// to create a route
router.post("/", RouteController.create.bind(RouteController));
// to get all routes
router.get("/", RouteController.getAll.bind(RouteController));
// to get a route by id
router.get("/:id", RouteController.getById.bind(RouteController));
// to delete a route
router.delete("/:id", RouteController.delete.bind(RouteController));
// to update a route
router.put("/:id", RouteController.update.bind(RouteController));
export default router;
