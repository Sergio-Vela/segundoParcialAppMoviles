import type { Location } from "../../domain/entities/Location";
import type { LocationRepository } from "../../domain/repositories/LocationRepository";

export class ListLocations {
    constructor(private readonly locationRepository: LocationRepository) {}

    execute(userId: number): Promise<Location[]> {
        return this.locationRepository.findByUserId(userId);
    }
}
