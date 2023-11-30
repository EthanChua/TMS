require("dotenv").config();
const mysql = require('mysql2');

// Create database connections
// pool is used to handle multiple connections, needed for promise
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit: 0,
});

/*
let sql = "SELECT * FROM accounts;";

pool.execute(sql, function (err,result){
    if (err) throw err;

    console.log(result);
});
*/

module.exports = pool.promise();
