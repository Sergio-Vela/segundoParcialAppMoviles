import type { Location } from "../entities/Location";

export interface LocationCreateInput {
    nombre: string;
    descripcion: string;
    latitud: number;
    longitud: number;
}

export interface LocationRepository {
    create(input: LocationCreateInput, userId: number): Promise<Location>;
    findByUserId(userId: number): Promise<Location[]>;
}
