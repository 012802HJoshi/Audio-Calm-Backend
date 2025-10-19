import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({
    path:`./.env.${process.env.NODE_ENV || 'development'}`
});

export const sequelize = new Sequelize(
    process.env.CONNECTION_DATABASE,
    process.env.USER_CONNECTION,
    process.env.CONNECTION_PASSWORD,
    {
    host:process.env.MYSQL_CONNECTION,
    port:process.env.PORT_MYSQL,
    dialect:"mysql",
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });


