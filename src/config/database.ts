import { Sequelize } from "sequelize";
import getConfig from "@config/dotenv";

const db: Sequelize = new Sequelize(
  getConfig("DB_NAME") as string,
  getConfig("DB_USERNAME") as string,
  getConfig("DB_PASSWORD") as string,
  {
    host: getConfig("DB_HOST") as string,
    port: parseInt(getConfig("DB_PORT") as string, 10),
    dialect: "postgres",
    logging: false,
    schema: "public",
    pool: {
      max: 100,
      min: 10,
      acquire: 5000,
      idle: 60000,
    },
  }
);

export default db;
