
import express from "express";

const router = express.Router();

import { getDashboardStats, createController, } from "../controllers/admin.controller.js";

import requireAdmin from "../middlewares/auth.middleware.js";

import { validate, createControllerSchema } from "../utils/validation.js";

// All admin routes require admin authentication
router.use(requireAdmin);

// GET dashboard stats
router.get("/dashboard", getDashboardStats);

// POST create a new controller account
router.post("/createcontroller", validate(createControllerSchema), createController);

export default router;
