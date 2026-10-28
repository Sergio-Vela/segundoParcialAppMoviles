import { Request, Response } from "express";
import type { LocationCreateInput } from "../../domain/repositories/LocationRepository";
import { CreateLocation } from "../../application/useCases/CreateLocation";
import { ListLocations } from "../../application/useCases/ListLocations";
import { SequelizeLocationRepository } from "../../infrastructure/repositories/SequelizeLocationRepository";
import { sendResponse } from "../helpers/ResponseHandler";

export class LocationController {
    private readonly locationRepository = new SequelizeLocationRepository();
    private readonly createLocation = new CreateLocation(this.locationRepository);
    private readonly listLocations = new ListLocations(this.locationRepository);

    async create(req: Request, res: Response): Promise<void> {
        if (req.userId === undefined) {
            sendResponse(res, 401, "Autenticacion requerida");
            return;
        }

        const input = this.validateCreateInput(req.body);
        if (!input) {
            sendResponse(res, 400, "Datos invalidos para registrar la ubicacion");
            return;
        }

        try {
            const location = await this.createLocation.execute(input, req.userId);
            sendResponse(res, 201, "Ubicacion creada exitosamente", location);
        } catch (error) {
            console.error("Error al crear la ubicacion:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        if (req.userId === undefined) {
            sendResponse(res, 401, "Autenticacion requerida");
            return;
        }

        try {
            const locations = await this.listLocations.execute(req.userId);
            sendResponse(res, 200, "Ubicaciones encontradas", locations);
        } catch (error) {
            console.error("Error al consultar las ubicaciones:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    private validateCreateInput(body: unknown): LocationCreateInput | null {
        if (!this.isRecord(body)) {
            return null;
        }

        const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
        const descripcion = typeof body.descripcion === "string" ? body.descripcion.trim() : "";
        const { latitud, longitud } = body;

        if (
            !nombre ||
            nombre.length > 255 ||
            !descripcion ||
            typeof latitud !== "number" ||
            !Number.isFinite(latitud) ||
            latitud < -90 ||
            latitud > 90 ||
            typeof longitud !== "number" ||
            !Number.isFinite(longitud) ||
            longitud < -180 ||
            longitud > 180
        ) {
            return null;
        }

        return { nombre, descripcion, latitud, longitud };
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
}
