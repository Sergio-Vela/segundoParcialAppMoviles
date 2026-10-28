import { Response } from "express";

export function sendResponse(
    res: Response,
    httpCode: number,
    message: string,
    body: unknown = null
): void {
    res.status(httpCode).json({
        standardResponse: {
            httpCode,
            message,
        },
        body,
    });
}
