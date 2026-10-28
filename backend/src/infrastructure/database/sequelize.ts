import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME ?? "LoginMovil",
    process.env.DB_USER ?? "postgres",
    process.env.DB_PASSWORD ?? "",
    {
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        dialect: "postgres",
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the database has been established successfuly.");
    } catch (error) {
        console.error("Unable to connect to the database: ", error);
        throw error;
    }
};