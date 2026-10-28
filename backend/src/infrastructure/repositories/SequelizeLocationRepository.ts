import type { Location as LocationEntity } from "../../domain/entities/Location";
import type { LocationCreateInput, LocationRepository } from "../../domain/repositories/LocationRepository";
import { Location } from "../models/locationModel";

export class SequelizeLocationRepository implements LocationRepository {
    async create(input: LocationCreateInput, userId: number): Promise<LocationEntity> {
        const location = await Location.create({ ...input, userId });
        return this.toEntity(location);
    }

    async findByUserId(userId: number): Promise<LocationEntity[]> {
        const locations = await Location.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
        return locations.map((location) => this.toEntity(location));
    }

    private toEntity(location: Location): LocationEntity {
        return {
            id: location.id,
            userId: location.userId,
            nombre: location.nombre,
            descripcion: location.descripcion,
            latitud: location.latitud,
            longitud: location.longitud,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt,
        };
    }
}
