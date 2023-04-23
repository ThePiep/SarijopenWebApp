import { Dialect, Sequelize } from "sequelize";
import mysql from "mysql2";
import { uitspraken } from "@/models/uitspraken";
import { bewoners } from "@/models/bewoners";
import { initModels } from "@/models/init-models";

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Dialect,
  dialectModule: mysql,
});

initModels(sequelize);

export default sequelize;
