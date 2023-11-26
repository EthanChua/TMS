const mysql = require('mysql2');

// Create database connection
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'TMS'
});

// Try to connect to database
database.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = database;
