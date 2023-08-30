import { Client } from "pg";
import { config } from "dotenv";

config();

export const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "expiry" DATE,
  "created_at" DATE NOT NULL,
  "updated_at" DATE
);
`;

client.connect();

client
  .query(createTableQuery)
  .catch((error) => {
    console.log(error);
  })
  .finally(() => client.end);
