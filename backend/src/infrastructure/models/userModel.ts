import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class User extends Model {
    declare public id: number;
    declare public nombre: string;
    declare public apellido: string;
    declare public usuario: string;
    declare public password: string;
    declare public rol: "administrador" | "censista" | null;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: [["administrador", "censista"]],
            },
        },
    },
    {
       sequelize,
       tableName: "users", 
    }
);