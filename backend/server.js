import mysql from "mysql2/promise";
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const caCert = fs
  .readFileSync(new URL("./certs/ca.pem", import.meta.url))
  .toString();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: caCert,
  },
});

try {
  const [results, fields] = await connection.query(
    "SELECT * FROM sourcepop LIMIT 100",
  );
  console.log(results);
  console.log(fields);
} catch (err) {
  console.error(err);
} finally {
  await connection.end();
}
