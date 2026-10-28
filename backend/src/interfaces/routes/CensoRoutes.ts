import { Router } from "express";
import { CensoController } from "../controllers/CensoController";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware";

const censoController = new CensoController();
export const censoRoutes = Router();

censoRoutes.use(authMiddleware);
censoRoutes.post("/", authorizeRoles("censista"), (req, res) => censoController.create(req, res));
censoRoutes.get("/mapa", authorizeRoles("administrador"), (req, res) => censoController.getMapPoints(req, res));
censoRoutes.get("/normales", authorizeRoles("administrador"), (req, res) => censoController.getNormal(req, res));
censoRoutes.get("/masivos", authorizeRoles("administrador"), (req, res) => censoController.getMassive(req, res));
censoRoutes.get("/", authorizeRoles("administrador"), (req, res) => censoController.getAll(req, res));
censoRoutes.get("/:id", authorizeRoles("administrador"), (req, res) => censoController.getById(req, res));

export default censoRoutes;
