import { UserProfile } from "../models/userProfileModel";
import { UserProfileService, UserProfilePayload } from "../../domain/services/UserProfileService";

export class UserProfileServiceImpl implements UserProfileService {
    async createProfile(userId: number, profileData: UserProfilePayload): Promise<UserProfile> {
        return UserProfile.create({
            userId,
            foto: profileData.foto ?? null,
            telefono: profileData.telefono ?? null,
            correo: profileData.correo ?? null,
            fechaNac: profileData.fechaNac ? new Date(profileData.fechaNac) : null,
            genero: profileData.genero ?? null,
        });
    }

    async getProfileByUserId(userId: number): Promise<UserProfile | null> {
        return UserProfile.findOne({ where: { userId } });
    }

    async updateProfile(userId: number, profileData: UserProfilePayload): Promise<UserProfile | null> {
        const profile = await this.getProfileByUserId(userId);
        if (!profile) {
            return null;
        }

        await profile.update({
            foto: profileData.foto ?? profile.foto,
            telefono: profileData.telefono ?? profile.telefono,
            correo: profileData.correo ?? profile.correo,
            fechaNac: profileData.fechaNac ? new Date(profileData.fechaNac) : profile.fechaNac,
            genero: profileData.genero ?? profile.genero,
        });

        return profile;
    }
}
