import { Dialect, Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { initModels } from '@/models/init-models';

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
});

initModels(sequelize);

export default sequelize;
