import { Request, Response } from "express";
import { Censo } from "../../infrastructure/models/censoModel";
import type { CensoCreateInput } from "../../domain/services/CensoService";
import { CensoServiceImpl } from "../../infrastructure/services/CensoServiceImpl";
import { sendResponse } from "../helpers/ResponseHandler";

type CensoResponse = {
    id: number;
    nombre: string;
    apellido: string;
    totalMiembros: number;
    cantidadTelevisiones: number;
    latitud: number;
    longitud: number;
    creadoPor: number | null;
    origenCarga: string;
    fechaCreacion: Date;
};

export class CensoController {
    private readonly censoService = new CensoServiceImpl();

    async create(req: Request, res: Response): Promise<void> {
        const input = this.validateCreateInput(req.body);
        if (!input) {
            sendResponse(res, 400, "Datos invalidos para registrar el censo");
            return;
        }
        if (req.userId === undefined) {
            sendResponse(res, 401, "Autenticacion requerida");
            return;
        }

        try {
            const censo = await this.censoService.create(input, req.userId);
            sendResponse(res, 201, "Censo creado exitosamente", this.toResponse(censo));
        } catch (error) {
            console.error("Error al crear el censo:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const censos = await this.censoService.getAll();
            sendResponse(res, 200, "Censos encontrados", censos.map((censo) => this.toResponse(censo)));
        } catch (error) {
            console.error("Error al consultar los censos:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const id = this.parseId(req.params.id);
        if (id === null) {
            sendResponse(res, 400, "El id del censo debe ser un entero positivo");
            return;
        }

        try {
            const censo = await this.censoService.getById(id);
            if (!censo) {
                sendResponse(res, 404, "Censo no encontrado");
                return;
            }
            sendResponse(res, 200, "Censo encontrado", this.toResponse(censo));
        } catch (error) {
            console.error("Error al consultar el censo:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getMapPoints(_req: Request, res: Response): Promise<void> {
        try {
            const censos = await this.censoService.getMapPoints();
            const points = censos.map((censo) => {
                const data = this.toResponse(censo);
                return {
                    id: data.id,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    totalMiembros: data.totalMiembros,
                    cantidadTelevisiones: data.cantidadTelevisiones,
                    latitud: data.latitud,
                    longitud: data.longitud,
                    origenCarga: data.origenCarga,
                    fechaCreacion: data.fechaCreacion,
                };
            });
            sendResponse(res, 200, "Censos para el mapa encontrados", points);
        } catch (error) {
            console.error("Error al consultar los censos para el mapa:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getMassive(_req: Request, res: Response): Promise<void> {
        try {
            const censos = await this.censoService.getMassive();
            sendResponse(res, 200, "Censos masivos encontrados", censos.map((censo) => this.toResponse(censo)));
        } catch (error) {
            console.error("Error al consultar los censos masivos:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getNormal(_req: Request, res: Response): Promise<void> {
        try {
            const censos = await this.censoService.getNormal();
            sendResponse(res, 200, "Censos normales encontrados", censos.map((censo) => this.toResponse(censo)));
        } catch (error) {
            console.error("Error al consultar los censos normales:", error);
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    private validateCreateInput(body: unknown): CensoCreateInput | null {
        if (!this.isRecord(body)) {
            return null;
        }
        const data = body;
        const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
        const apellido = typeof data.apellido === "string" ? data.apellido.trim() : "";
        const totalMiembros = data.totalMiembros;
        const cantidadTelevisiones = data.cantidadTelevisiones;
        const latitud = data.latitud;
        const longitud = data.longitud;

        if (
            !nombre ||
            nombre.length > 255 ||
            !apellido ||
            apellido.length > 255 ||
            typeof totalMiembros !== "number" ||
            !Number.isSafeInteger(totalMiembros) ||
            totalMiembros <= 0 ||
            typeof cantidadTelevisiones !== "number" ||
            !Number.isSafeInteger(cantidadTelevisiones) ||
            cantidadTelevisiones < 0 ||
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

        return {
            nombre,
            apellido,
            totalMiembros,
            cantidadTelevisiones,
            latitud,
            longitud,
        };
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    private parseId(value: string | string[] | undefined): number | null {
        if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
            return null;
        }
        const id = Number(value);
        return Number.isSafeInteger(id) ? id : null;
    }

    private toResponse(censo: Censo): CensoResponse {
        return {
            id: censo.id,
            nombre: censo.nombre,
            apellido: censo.apellido,
            totalMiembros: censo.totalMiembros,
            cantidadTelevisiones: censo.cantidadTelevisiones,
            latitud: Number(censo.latitud),
            longitud: Number(censo.longitud),
            creadoPor: censo.creadoPor,
            origenCarga: censo.origenCarga,
            fechaCreacion: censo.fechaCreacion,
        };
    }
}
