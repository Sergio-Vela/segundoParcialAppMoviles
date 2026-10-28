import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../infrastructure/services/JwtService";
import { User } from "../../infrastructure/models/userModel";
import type { UserRole } from "../../domain/services/UserService";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            username?: string;
            userRole?: UserRole | null;
        }
    }
}

const jwtService = new JwtService();

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;

    if (!token) {
        res.status(401).json({ message: "Token requerido" });
        return;
    }

    let payload;
    try {
        payload = jwtService.verifyToken(token);
    } catch {
        res.status(401).json({ message: "Token invalido o expirado" });
        return;
    }

    try {
        const user = await User.findByPk(payload.userId);
        if (!user) {
            res.status(401).json({ message: "Usuario autenticado no encontrado" });
            return;
        }

        req.userId = user.id;
        req.username = payload.usuario;
        req.userRole = user.rol;
        next();
    } catch (error) {
        next(error);
    }
}

export function authorizeRoles(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.userId === undefined) {
            res.status(401).json({ message: "Autenticacion requerida" });
            return;
        }
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            res.status(403).json({ message: "No tienes permisos para realizar esta operacion" });
            return;
        }
        next();
    };
}
