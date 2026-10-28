import { Request, Response } from "express";
import { UserServiceImpl } from "../../infrastructure/services/UserServiceImpl";
import { JwtService } from "../../infrastructure/services/JwtService";
import { sendResponse } from "../helpers/ResponseHandler";

export class UserController {
	private readonly userService = new UserServiceImpl();
	private readonly jwtService = new JwtService();

	async createUser(req: Request, res: Response): Promise<void> {
		try {
			const { nombre, apellido, usuario, password } = req.body;
			if (!nombre || !apellido || !usuario || !password) {
				sendResponse(res, 400, "Faltan campos obligatorios: nombre, apellido, usuario y password");
				return;
			}
			const user = await this.userService.createUser(nombre, apellido, usuario, password, "censista");
			sendResponse(res, 201, "Usuario creado exitosamente", this.publicUser(user));
		} catch {
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async getUserById(req: Request, res: Response): Promise<void> {
		try {
			const user = await this.userService.getUserById(Number(req.params.id));
			if (!user) {
				sendResponse(res, 404, "Usuario no encontrado");
				return;
			}
			sendResponse(res, 200, "Usuario encontrado", this.publicUser(user));
		} catch {
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async getUserByUsername(req: Request, res: Response): Promise<void> {
		try {
			const user = await this.userService.getUserByUsername(String(req.params.usuario));
			if (!user) {
				sendResponse(res, 404, "Usuario no encontrado");
				return;
			}
			sendResponse(res, 200, "Usuario encontrado", this.publicUser(user));
		} catch {
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const { usuario, password } = req.body;
			if (!usuario || !password) {
				sendResponse(res, 400, "Faltan campos obligatorios: usuario y password");
				return;
			}
			const user = await this.userService.login(usuario, password);
			if (!user) {
				sendResponse(res, 401, "Credenciales inválidas");
				return;
			}
			sendResponse(res, 200, "Login exitoso", {
				token: this.jwtService.generateToken(user),
				user: this.publicUser(user),
			});
		} catch {
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const { nombre, apellido, usuario } = req.body;
			if (!nombre || !apellido || !usuario) {
				sendResponse(res, 400, "Faltan campos obligatorios: nombre, apellido y usuario");
				return;
			}
			await this.userService.updateUser(Number(req.params.id), nombre, apellido, usuario);
			sendResponse(res, 204, "Operación exitosa");
		} catch (error) {
			if (error instanceof Error && error.message === "User not found") {
				sendResponse(res, 404, "Usuario no encontrado");
				return;
			}
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const deleted = await this.userService.deleteUser(Number(req.params.id));
			if (!deleted) {
				sendResponse(res, 404, "Usuario no encontrado");
				return;
			}
			sendResponse(res, 204, "Operación exitosa");
		} catch {
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	async changePassword(req: Request, res: Response): Promise<void> {
		try {
			const { currentPassword, newPassword } = req.body;
			if (!currentPassword || !newPassword || newPassword.length < 8) {
				sendResponse(res, 400, "Faltan campos obligatorios: currentPassword y newPassword; newPassword debe tener al menos 8 caracteres");
				return;
			}
			await this.userService.changePassword(req.userId!, currentPassword, newPassword);
			sendResponse(res, 204, "Operación exitosa");
		} catch (error) {
			if (error instanceof Error && error.message === "Invalid current password") {
				sendResponse(res, 401, "Contraseña actual incorrecta");
				return;
			}
			sendResponse(res, 500, "Error interno del servidor");
		}
	}

	private publicUser(user: { id: number; nombre: string; apellido: string; usuario: string; rol: string | null }) {
		return { id: user.id, nombre: user.nombre, apellido: user.apellido, usuario: user.usuario, rol: user.rol };
	}
}
