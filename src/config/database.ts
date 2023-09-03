import { config } from "dotenv";
import pgPromise from "pg-promise";

config();

const pgp = pgPromise({});

const DBconfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};

export const db = pgp(DBconfig);

db.none(`CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  expiry TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);`);
