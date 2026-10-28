import { Router } from "express";
import { LocationController } from "../controllers/LocationController";
import { authMiddleware } from "../middleware/authMiddleware";

const locationController = new LocationController();
export const locationRoutes = Router();

locationRoutes.use(authMiddleware);
locationRoutes.post("/", (req, res) => locationController.create(req, res));
locationRoutes.get("/", (req, res) => locationController.getAll(req, res));

export default locationRoutes;
