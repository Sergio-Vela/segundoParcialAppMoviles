import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";
import { User } from "./userModel";

export type CensoOrigin = "NORMAL" | "MASIVA";

export class Censo extends Model {
    declare public id: number;
    declare public nombre: string;
    declare public apellido: string;
    declare public totalMiembros: number;
    declare public cantidadTelevisiones: number;
    declare public latitud: number;
    declare public longitud: number;
    declare public creadoPor: number | null;
    declare public origenCarga: CensoOrigin;
    declare public fechaCreacion: Date;
    declare public createdAt: Date;
    declare public updatedAt: Date;
    declare public creador?: User | null;
}

Censo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        totalMiembros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1,
            },
        },
        cantidadTelevisiones: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 0,
            },
        },
        latitud: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: false,
            validate: {
                min: -90,
                max: 90,
            },
        },
        longitud: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
            validate: {
                min: -180,
                max: 180,
            },
        },
        creadoPor: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        origenCarga: {
            type: DataTypes.ENUM("NORMAL", "MASIVA"),
            allowNull: false,
            defaultValue: "NORMAL",
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "censos",
    }
);
