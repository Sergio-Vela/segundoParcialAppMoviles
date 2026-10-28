import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { sendResponse } from "../helpers/ResponseHandler";

class InvalidImageTypeError extends Error {}

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            callback(new InvalidImageTypeError("Formato de imagen no permitido"));
            return;
        }
        callback(null, true);
    },
});

export function uploadProfilePhoto(req: Request, res: Response, next: NextFunction): void {
    upload.single("foto")(req, res, (error?: unknown) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof InvalidImageTypeError) {
            sendResponse(res, 400, "Formato de imagen no permitido. Tipos permitidos: JPEG, PNG, GIF y WebP");
            return;
        }

        if (error instanceof multer.MulterError) {
            const message = error.code === "LIMIT_FILE_SIZE"
                ? "La fotografía no debe superar los 10 MB"
                : "Archivo de imagen inválido";
            sendResponse(res, 400, message);
            return;
        }

        next(error);
    });
}
