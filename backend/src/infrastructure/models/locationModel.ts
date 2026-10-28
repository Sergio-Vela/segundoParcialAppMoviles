
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class Location extends Model {
    declare public id: number;
    declare public userId: number;
    declare public nombre: string;
    declare public descripcion: string;
    declare public latitud: number;
    declare public longitud: number;
    declare public createdAt: Date;
    declare public updatedAt: Date;
}

Location.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        latitud: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                min: -90,
                max: 90,
            },
        },
        longitud: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                min: -180,
                max: 180,
            },
        },
    },
    {
        sequelize,
        tableName: "locations",
        timestamps: true,
    }
);
