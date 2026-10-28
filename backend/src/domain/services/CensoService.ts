import { Censo } from "../../infrastructure/models/censoModel";

export interface CensoCreateInput {
    nombre: string;
    apellido: string;
    totalMiembros: number;
    cantidadTelevisiones: number;
    latitud: number;
    longitud: number;
}

export interface CensoService {
    create(input: CensoCreateInput, creadoPor: number): Promise<Censo>;
    getAll(): Promise<Censo[]>;
    getById(id: number): Promise<Censo | null>;
    getMapPoints(): Promise<Censo[]>;
    getNormal(): Promise<Censo[]>;
    getMassive(): Promise<Censo[]>;
}
