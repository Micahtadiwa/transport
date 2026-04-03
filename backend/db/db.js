import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const con = await mysql.createConnection({
    host: process.env.DB_HOST.replace(/"/g, ""), // removes quotes
    user: process.env.DB_USER.replace(/"/g, ""),
    password: process.env.DB_PASSWORD.replace(/"/g, ""),
    database: process.env.DB_NAME.replace(/"/g, ""),
    port: 3306
});

console.log("✅ Connected to MySQL database");

export default con;