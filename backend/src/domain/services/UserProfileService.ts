import { UserProfile } from "../../infrastructure/models/userProfileModel";

export type UserProfilePayload = {
    foto?: Buffer | null;
    telefono?: string | null;
    correo?: string | null;
    fechaNac?: Date | string | null;
    genero?: string | null;
};

export interface UserProfileService {
    createProfile(userId: number, profileData: UserProfilePayload): Promise<UserProfile>;
    getProfileByUserId(userId: number): Promise<UserProfile | null>;
    updateProfile(userId: number, profileData: UserProfilePayload): Promise<UserProfile | null>;
}
