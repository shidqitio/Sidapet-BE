import { Sequelize } from "sequelize";
import getConfig from "@config/dotenv";

const db: Sequelize = new Sequelize({
    dialect: "postgres",
    logging: console.log,
    replication : {
      read : [
        {
          host : getConfig("DB_HOST"), username : getConfig("DB_USERNAME"), password: getConfig("DB_PASSWORD"), database : getConfig("DB_NAME")
        }
      ],
      write : 
        {
          host: getConfig("DB_HOST"), username : getConfig("DB_USERNAME"), password: getConfig("DB_PASSWORD"), database : getConfig("DB_NAME")
        }
    },
    schema : "public",
    pool: {
      max: 100,
      min: 10,
      acquire: 5000,
      idle: 60000,
    },
  });

export default db;