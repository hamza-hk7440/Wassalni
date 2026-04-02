
import express from "express";

const router = express.Router();

import { getDashboardStats, createController, getAllUsers, deleteUser} from "../controllers/admin.controller.js";

import requireAdmin from "../middlewares/auth.middleware.js";

import { validate, createControllerSchema } from "../utils/validation.js";

// All admin routes require admin authentication
router.use(requireAdmin);

// GET dashboard stats
router.get("/dashboard", getDashboardStats);

// POST create a new controller account
router.post("/createcontroller", validate(createControllerSchema), createController);

// get all users for the dashboard
router.get("/users", getAllUsers);

// delete a user (permanent)
router.delete("/users/:userId", deleteUser);



export default router;

