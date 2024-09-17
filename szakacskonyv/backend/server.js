require('dotenv').config()
const express = require('express')
var mysql = require('mysql');
var cors = require('cors')
var CryptoJS = require("crypto-js");
const uuid = require('uuid');


const app = express()
app.use(cors())
const port = process.env.PORT;
const passwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

var pool = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});
  
// user regisztráció
app.post('/reg', (req, res) => {

    // ha nincsenek az adatok megadva akkor gg
    if(!req.body.name || !req.body.email || !req.body.passwd || !req.body.confirm){
        res.status(203).send(`Nem adtál meg minden kötelező adatot`)
        return;
    }

    // jelszavak ellenőrzése
    if(req.body.passwd != req.body.confirm){
        res.status(203).send(`A jelszók nem eggyeznek meg`)
        return;
    }
    // regexnek megfelel-e a jelszó
    if(!req.body.passwd.match(passwdReg)){
        res.status(203).send(`A jelszó nem felel meg a követelményeknek`);
        return;
    }

    // email cím ellenőrzése
    pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, results) => {
        if(err){
            res.status(500).send("Hiba történt az adatbázis elérése kézben!");
            return;
        }

        // ha van már ilyen email cím
        if(results.length != 0){
            res.status(203).send("Ez az e-email cím már regisztrálva van");
            return;
        }

        // új felhasználó felvétele
        pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', '${req.body.password}')`)

    });
    


});



app.listen(port, () => {
    console.log(`Server is listening on port '${port}'`);

});

/*
szakacskonyv - users

felhasználó kezelés:

POST /reg - user regiszráció
POST /login - user belépés
GET /me - bejelentkezett felhasználó adatai
GET /users - felhasználók listája (admin)
GET /users/:id - 
PATCH /passmod/:Id - jelszóváltoztatás
DELETE /users/:id - adott idjű user törlése (admin)




*/ 
