import { Censo } from "../models/censoModel";
import type { CensoCreateInput, CensoService } from "../../domain/services/CensoService";

export class CensoServiceImpl implements CensoService {
    async create(input: CensoCreateInput, creadoPor: number): Promise<Censo> {
        return Censo.create({
            ...input,
            creadoPor,
            origenCarga: "NORMAL",
        });
    }

    async getAll(): Promise<Censo[]> {
        return Censo.findAll({
            order: [["fechaCreacion", "DESC"]],
        });
    }

    async getById(id: number): Promise<Censo | null> {
        return Censo.findByPk(id);
    }

    async getMapPoints(): Promise<Censo[]> {
        return Censo.findAll({
            attributes: [
                "id",
                "nombre",
                "apellido",
                "totalMiembros",
                "cantidadTelevisiones",
                "latitud",
                "longitud",
                "origenCarga",
                "fechaCreacion",
            ],
            order: [["fechaCreacion", "DESC"]],
        });
    }

    async getMassive(): Promise<Censo[]> {
        return this.getByOrigin("MASIVA");
    }

    async getNormal(): Promise<Censo[]> {
        return this.getByOrigin("NORMAL");
    }

    private async getByOrigin(origenCarga: "NORMAL" | "MASIVA"): Promise<Censo[]> {
        return Censo.findAll({
            where: { origenCarga },
            order: [["fechaCreacion", "DESC"]],
        });
    }
}
