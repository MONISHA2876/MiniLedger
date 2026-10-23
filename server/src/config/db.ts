import dotenv = require("dotenv");
import pg = require("pg");
import process = require("node:process");

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

export = { pool };