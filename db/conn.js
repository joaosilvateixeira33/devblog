const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'toor_passwd',
    database: 'devblog'
})

module.exports = pool;