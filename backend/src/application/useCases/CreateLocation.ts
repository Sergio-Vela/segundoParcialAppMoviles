import type { Location } from "../../domain/entities/Location";
import type { LocationCreateInput, LocationRepository } from "../../domain/repositories/LocationRepository";

export class CreateLocation {
    constructor(private readonly locationRepository: LocationRepository) {}

    execute(input: LocationCreateInput, userId: number): Promise<Location> {
        return this.locationRepository.create(input, userId);
    }
}
