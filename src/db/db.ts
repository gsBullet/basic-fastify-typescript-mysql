
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let host = process.env.DB_HOST || "";
let port = process.env.DB_PORT || 3306;
let user = process.env.DB_USER || "";
let password = process.env.DB_PASSWORD || "";
let database = process.env.DB_NAME || "";

const sequelize = new Sequelize(
  `mysql://${user}:${password}@${host}:${port}/${database}`,
  {
    logging: false,
  }
);


export default sequelize;
