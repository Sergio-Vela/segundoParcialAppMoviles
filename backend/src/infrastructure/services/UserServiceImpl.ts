import { UserRole, UserService } from "../../domain/services/UserService";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";

export class UserServiceImpl implements UserService {
    async createUser(nombre: string, apellido: string, usuario: string, password: string, rol: UserRole): Promise<User> {
        const passwordHash = await bcrypt.hash(password, 12);
        return User.create({ nombre, apellido, usuario, password: passwordHash, rol });
    }

    async getUserById(id: number): Promise<User | null> {
        return User.findByPk(id);
    }

    async getUserByUsername(usuario: string): Promise<User | null> {
        return User.findOne({ where: { usuario } });
    }

    async login(usuario: string, password: string): Promise<User | null> {
        const user = await this.getUserByUsername(usuario);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        return user;
    }

    async updateUser(id: number, nombre: string, apellido: string, usuario: string): Promise<void> {
        const [updated] = await User.update(
            { nombre, apellido, usuario },
            { where: { id } }
        );
        if (updated === 0) {
            throw new Error("User not found");
        }
    }

    async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.getUserById(id);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            throw new Error("Invalid current password");
        }
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
    }

    async deleteUser(id: number): Promise<boolean> {
        return (await User.destroy({ where: { id } })) > 0;
    }
}