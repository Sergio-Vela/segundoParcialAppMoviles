import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel";

dotenv.config();

export interface AuthTokenPayload {
    userId: number;
    usuario: string;
}

export class JwtService {
    private readonly secret = process.env.JWT_SECRET ?? "development-secret-change-me";
    private readonly expiresIn = (process.env.JWT_EXPIRES_IN ?? "1h") as NonNullable<jwt.SignOptions["expiresIn"]>;

    generateToken(user: Pick<User, "id" | "usuario">): string {
        const options: jwt.SignOptions = {
            subject: String(user.id),
            expiresIn: this.expiresIn,
        };
        return jwt.sign({ usuario: user.usuario }, this.secret, options);
    }

    verifyToken(token: string): AuthTokenPayload {
        const payload = jwt.verify(token, this.secret);
        if (
            typeof payload === "string" ||
            typeof payload.sub !== "string" ||
            !/^[1-9]\d*$/.test(payload.sub) ||
            !Number.isSafeInteger(Number(payload.sub)) ||
            typeof payload.usuario !== "string"
        ) {
            throw new Error("Invalid token payload");
        }
        return { userId: Number(payload.sub), usuario: payload.usuario };
    }
}
