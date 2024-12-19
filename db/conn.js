const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'toor',
    database: 'devblog'
})

module.exports = pool;