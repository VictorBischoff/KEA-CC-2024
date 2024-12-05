// Read the README.md file for instructions on how to use this API

import mysql from "mysql2";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Download the CA certificate from the AVIEN MySQL server and store it in the certs folder
const caCert = fs
  .readFileSync(new URL("./certs/ca.pem", import.meta.url))
  .toString();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: caCert,
  },
}).promise();

// Function to fetch data from the database
async function getData(table, limit) {
  const [rows] = await connection.query(`SELECT * FROM ${table} LIMIT ${limit}`);
  return rows;
}

// Route to fetch data from the database, use the table query parameter to specify the table name and the limit query parameter to specify the number of rows to fetch
app.get('/api/data', async (req, res) => {
  const table = req.query.table; 
  const limit = parseInt(req.query.limit, 10) || 10; 
  if (!table) {
      return res.status(400).json({ error: "Table parameter is required" });
  }

  try {
    const data = await getData(table, limit); // Await the async function
    res.json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});