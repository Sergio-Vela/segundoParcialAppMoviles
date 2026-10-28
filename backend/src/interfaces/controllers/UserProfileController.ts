import { Request, Response } from "express";
import { UserProfileServiceImpl } from "../../infrastructure/services/UserProfileServiceImpl";
import { sendResponse } from "../helpers/ResponseHandler";

export class UserProfileController {
    private readonly userProfileService = new UserProfileServiceImpl();

    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const profile = await this.userProfileService.getProfileByUserId(Number(req.params.id));
            if (!profile) {
                sendResponse(res, 404, "Perfil no encontrado");
                return;
            }
            sendResponse(res, 200, "Perfil encontrado", {
                id: profile.id,
                userId: profile.userId,
                telefono: profile.telefono,
                correo: profile.correo,
                fechaNac: profile.fechaNac,
                genero: profile.genero,
            });
        } catch {
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async createUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const { telefono, correo, fechaNac, genero } = req.body;
            const profile = await this.userProfileService.createProfile(userId, {
                foto: req.file?.buffer ?? null,
                telefono: telefono ?? null,
                correo: correo ?? null,
                fechaNac: fechaNac ?? null,
                genero: genero ?? null,
            });
            sendResponse(res, 201, "Perfil creado exitosamente", {
                id: profile.id,
                userId: profile.userId,
                telefono: profile.telefono,
                correo: profile.correo,
                fechaNac: profile.fechaNac,
                genero: profile.genero,
            });
        } catch {
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async updateUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const { telefono, correo, fechaNac, genero } = req.body;
            const profile = await this.userProfileService.updateProfile(userId, {
                ...(req.file ? { foto: req.file.buffer } : {}),
                telefono: telefono ?? null,
                correo: correo ?? null,
                fechaNac: fechaNac ?? null,
                genero: genero ?? null,
            });
            if (!profile) {
                sendResponse(res, 404, "Perfil no encontrado");
                return;
            }
            sendResponse(res, 200, "Perfil actualizado exitosamente", {
                id: profile.id,
                userId: profile.userId,
                telefono: profile.telefono,
                correo: profile.correo,
                fechaNac: profile.fechaNac,
                genero: profile.genero,
            });
        } catch {
            sendResponse(res, 500, "Error interno del servidor");
        }
    }

    async getUserProfilePhoto(req: Request, res: Response): Promise<void> {
        try {
            const profile = await this.userProfileService.getProfileByUserId(Number(req.params.id));
            if (!profile?.foto) {
                sendResponse(res, 404, "Fotografía no encontrada");
                return;
            }
            res.type("application/octet-stream").send(profile.foto);
        } catch {
            sendResponse(res, 500, "Error interno del servidor");
        }
    }
}
