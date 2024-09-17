require('dotenv').config()
const express = require('express')
var mysql = require('mysql');
var cors = require('cors')
var CryptoJS = require("crypto-js");
const uuid = require('uuid');


const app = express()
app.use(cors())
const port = porcess.env.PORT;

var pool = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});
  

app.listen(port, () => {
    console.log(`Server is listening on port '${port}'`);

});
