import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class UserProfile extends Model {
    declare public id: number;
    declare public userId: number;
    declare public foto: Buffer | null;
    declare public telefono: string | null;
    declare public correo: string | null;
    declare public fechaNac: Date | null;
    declare public genero: string | null;
}

UserProfile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foto: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fechaNac: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        genero: {
            type: DataTypes.CHAR(1),
            allowNull: true,
        }
    },
    {
       sequelize,
       tableName: "userProfiles", 
    }
);