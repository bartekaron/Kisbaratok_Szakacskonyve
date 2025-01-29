const uuid = require('uuid');
const express = require('express')
const router = express.Router();
var CryptoJS = require("crypto-js");
const db = require('./database');
const { logincheck,admincheck } = require('./middlewares');
const passwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


// user regisztráció
router.post('/reg', (req, res) => {
    
    // ha nincsenek az adatok megadva akkor gg
    if(!req.body.name || !req.body.email || !req.body.passwd || !req.body.confirm){
        res.status(203).send('Nem adtál meg minden kötelező adatot')
        return;
    }

   /* if(!req.body.phone){
        req.body.phone = "";
        return;
    }*/

    // jelszavak ellenőrzése
    if(req.body.passwd != req.body.confirm){
        res.status(203).send('A jelszók nem eggyeznek meg')
        return;
    }
    // regexnek megfelel-e a jelszó
    if(!req.body.passwd.match(passwdReg)){
        res.status(203).send('A jelszó nem felel meg a követelményeknek');
        return;
    }

   

    // email cím ellenőrzése
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése kézben!');
            return;
        }

        // ha van már ilyen email cím
        if(results.length != 0){
            res.status(203).send('Ez az e-email cím már regisztrálva van');
            return;
        }

        // új felhasználó felvétele
      
        db.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', SHA1('${req.body.passwd}'), '${req.body.phone}', 'user', 'true' )`, (err, results) => {
            if(err){
                res.status(500).send('Hiba történt az adatbázis művelet közben!');
                return;
            }
            res.status(202).send('Sikeres regisztráció!');
            return;

        });
        return;
    });
    


});
 // bejelentkezés
router.post('/log', (req, res) => {

    //nincs email vagy jelszó akkor gg    
    if(!req.body.email || !req.body.passwd){
        res.status(203).send("Hiánnyzó adatok!");
        return;
    }
    
    db.query(`SELECT ID, name, email, phone, role, status FROM users WHERE email = '${req.body.email}' AND passwd = '${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) => {
        if(err){
            res.status(500).send("Hiba történt az adatbázis lekérés közben!");
            return;
        }
        if(results.length == 0) {
            res.status(203).send('Hibás belépési adatok!');
            return;
        }
        res.status(202).send(results);
        return;
    });
});
 // felhasználó saját adatainak beszerzése
 router.get('/me/:id', logincheck, (req, res) => {
    // nincs id akkor gg
    if(!req.params.id){
        res.status(203).send('Hiányzó azonósitó');
        return;
    }

    db.query(`SELECT name, email, phone, role FROM users WHERE ID='${req.params.id}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        if(results.length == 0){
            res.status(203).send('Hibás azonosító!');
            return;
        }

        res.status(200).send(results);
        return;

    });

});
// összes kisbarát adatainak bebúrása (ADMIN)
router.get('/', admincheck, (req, res) => {
    db.query(`SELECT ID, name, email, phone, role, status FROM users`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;

    });

})
// id alapján kisbarát kiválasztása (ADMIN)
router.get('/:id', admincheck, (req, res) => {
    //nincs id akkor gg
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító');
        return;
    }

    db.query(`SELECT name, email, phone, role FROM users WHERE ID='${req.params.id}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        if(results.length == 0) {
            res.status(203).send('Hiányzó azonosító!');
            return;
        }
        res.status(202).send(results);
        return;
    });

});
// id alapján kisbarát adatának módosítása
router.patch('/:id', /*logincheck,*/ (req, res) => {
    console.log(req.body);
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    if(!req.body.name || !req.body.email){
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    db.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', phone='${req.body.phone}', role='${req.body.role}', status='${req.body.status}' WHERE ID='${req.params.id}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        if(results.affectedRows == 0){
            res.status(203).send('Hibás azonosító!');
            return;
        }

        res.status(200).send('Sikeres módosítás!');
        return;
    });

});
router.patch('/userMod/:id', /*logincheck,*/ (req, res) => {
    console.log(req.body);
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    if(!req.body.name || !req.body.email){
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    db.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', phone='${req.body.phone}' WHERE ID='${req.params.id}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        if(results.affectedRows == 0){
            res.status(203).send('Hibás azonosító!');
            return;
        }

        res.status(200).send('Sikeres módosítás!');
        return;
    });

});
// id alapján kisbarát jelszavának módosítása
router.patch('/passmod/:id', (req, res) => {
    if(!req.params.id){
        res.status(203).send('Hibás azonosító!');
        return;
    }
    // van-e régi jelszó, új jelszó, új jelszó megerősítése
    if(!req.body.oldpass || !req.body.newpass || !req.body.confirm){
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    //új jelszó megyegyezik-e a megerősítéses jelszóval
    if(req.body.newpass != req.body.confirm){
        res.status(203).send('A jelszavak nem egyeznek!');
        return;
    }
    //regexel kisbarát-e az új jelszó
    if(!req.body.newpass.match(passwdReg)){
        res.status(203).send('Az új jelszó nem felel meg a követelményeknek!');
        return;
    }
    // jó-e a korábban megadott jelszó
    db.query(`SELECT passwd FROM users WHERE ID='${req.params.id}'`, (err, results) => {
        if(err){
            res.status(500).send('Hiba az adatbázis elérése közben!');
            return;
        }
        if(results.length == 0){
            res.status(203).send('Hibás azonosító!');
            return;
        }
        // régi jelszó megegyezik-e a régivel titkosmikkentyűzve
        if(results[0].passwd != CryptoJS.SHA1(req.body.oldpass)){
            res.status(203).send('A jelenlegi jelszó nem megfelelő!');
            return;
        }


        db.query(`UPDATE users SET passwd=SHA1('${req.body.newpass}') WHERE ID='${req.params.id}'`, (err, results) => {
            if(err){
                res.status(500).send('Hiba történt az adatbázis elérése közben!');
                return;
            }
            if(results.affectedRows == 0){
                res.status(203).send('Hibás az azonosító!');
                return;
            }

            res.status(200).send('Sikeres jelszó módosítás!');
            return;


        });


    });
    


});
// felhasználó törlése id alapján

router.delete('/:id', (req, res) => {

    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    db.query(`DELETE FROM users WHERE ID='${req.params.id}'`, (err, results) => {

        if(err){
            res.status(500).send('Hiba történt az adatbázis lekérése közben!');
            return;
        }

        if(results.affectedRows == 0){
            res.status(203).send('Hibás az azonosító!');
            return;
        }

        res.status(200).send('Felhasználó törölve!');
        return;

    });

});
module.exports = router;