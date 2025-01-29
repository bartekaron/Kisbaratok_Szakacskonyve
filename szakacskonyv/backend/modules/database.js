var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});

module.exports = pool;