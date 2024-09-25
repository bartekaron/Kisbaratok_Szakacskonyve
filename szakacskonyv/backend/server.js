require('dotenv').config()
const express = require('express')
var mysql = require('mysql');
var cors = require('cors')
var CryptoJS = require("crypto-js");
const uuid = require('uuid');
const app = express();
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
const port = process.env.PORT;
const passwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

var pool = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});

// get API version
app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
});

  
// user regisztráció
app.post('/reg', (req, res) => {
    
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
    pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, results) => {
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
      
        pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', SHA1('${req.body.passwd}'), '${req.body.phone}', 'user', 'true' )`, (err, results) => {
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
app.post('/log', (req, res) => {

    //nincs email vagy jelszó akkor gg    
    if(!req.body.email || !req.body.passwd){
        res.status(203).send("Hiánnyzó adatok!");
        return;
    }
    
    pool.query(`SELECT ID, name, email, phone, role, status FROM users WHERE email = '${req.body.email}' AND passwd = '${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) => {
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
app.get('/me/:id', logincheck, (req, res) => {
    // nincs id akkor gg
    if(!req.params.id){
        res.status(203).send('Hiányzó azonósitó');
        return;
    }

    pool.query(`SELECT name, email, phone, role FROM users WHERE ID='${req.params.id}'`, (err, results) => {
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
app.get('/users', admincheck, (req, res) => {
    pool.query(`SELECT ID, name, email, phone, role, status FROM users`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;

    });

})
// id alapján kisbarát kiválasztása (ADMIN)
app.get('/users/:id', admincheck, (req, res) => {
    //nincs id akkor gg
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító');
        return;
    }

    pool.query(`SELECT name, email, phone, role FROM users WHERE ID='${req.params.id}'`, (err, results) => {
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
app.patch('/users/:id', /*logincheck,*/ (req, res) => {
    console.log(req.body);
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    if(!req.body.name || !req.body.email || !req.body.role){
        res.status(203).send('Hiányzó adatok!');
        return;
    }

    pool.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', phone='${req.body.phone}', role='${req.body.role}', status='${req.body.status}' WHERE ID='${req.params.id}'`, (err, results) => {
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
app.patch('/passmod/:id', (req, res) => {
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
    pool.query(`SELECT passwd FROM users WHERE ID='${req.params.id}'`, (err, results) => {
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


        pool.query(`UPDATE users SET passwd=SHA1('${req.body.newpass}') WHERE ID='${req.params.id}'`, (err, results) => {
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

app.delete('/users/:id', (req, res) => {

    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    pool.query(`DELETE FROM users WHERE ID='${req.params.id}'`, (err, results) => {

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


// MIDDLEWARE functions


// bejelentkezés (legyé bejelentkezve különben kapod)

function logincheck(req, res, next) {
    let token = req.header('Authorization');
    if(!token) {
        res.status(400).send('Jelentkezz be!');
        return;
    }

    pool.query(`SELECT * FROM users WHERE ID='${token}'`, (err, results) => {
        if(results.length == 0){
            res.status(400).send('Hibás autentikáció!');
        }   
        next();
    });

    return;
}

// jogosultság ellenőrzése (admin vagy nem)
function admincheck(req, res, next){
    let token = req.header('Authorization');
    if(!token) {
        res.status(400).send('Jelentkezz be');
        return;
    }

    pool.query(`SELECT role FROM users WHERE ID='${token}'`, (err, results) => {
        if(results.length == 0){
            res.status(400).send('Hibás autentikáció!');
            return;
        }
        if(results[0].role != 'admin'){
            res.status(400).send('Nincs jogod!');
            return;
        }
        next();


    });
    return;

}

// Kategória hozzáadása
app.post('/category', (req, res) => {
    if (!req.body.name) {
        res.status(400).send('A kategória neve kötelező');
        return;
    }
    const categoryId = uuid.v4();
    const categoryName = req.body.name;
    pool.query('INSERT INTO categories (id, name) VALUES (?, ?)', [categoryId, categoryName], (err, results) => {
        if (err) {
            res.status(500).send('Hiba történt a kategória hozzáadása során');
            return;
        }
        res.status(200).send('Kategória sikeresen hozzáadva');
        return;
    });
});
//Összes recept
app.get('/recipes', (req, res) => {
    pool.query(`SELECT ID, catID, userID, title, descp, time, additions, calorie FROM recipes`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    });
})
//Recept hozzáadás
app.post('/addRecipe', (req, res) => {
    
    const { catID, userID, title, descp, time, additions, calorie } = req.body;
    const query = `INSERT INTO recipes (ID, catID, userID, title, descp, time, additions, calorie) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [uuid.v4(), catID, userID, title, descp, time, additions, calorie];

    if(!req.body.title || !req.body.descp || !req.body.time || !req.body.additions || !req.body.calorie){
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    
    if(req.body.calorie == 0 || req.body.time == 0)
    {
        res.status(203).send('Nem lehet 0 a kalória vagy az idő!')
    }

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error(err); // Naplózza a hibát
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        res.status(201).send('Recept sikeresen hozzáadva!');
    });
});
//Összes kategória
app.get('/categories', (req, res) => {
    pool.query(`SELECT ID, name FROM categories`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    })
});
//Id alapján kategória
app.get('/categories/:id', (req, res) => {
    pool.query(`SELECT ID, name FROM categories WHERE ID='${req.params.id}'`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    });
})
//Kategória törlés
app.delete('/deleteCat/:id', (req, res) =>{
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    pool.query(`DELETE FROM categories WHERE ID='${req.params.id}'`, (err, results) => {

        if(err){
            res.status(500).send('Hiba történt az adatbázis lekérése közben!');
            return;
        }

        if(results.affectedRows == 0){
            res.status(203).send('Hibás az azonosító!');
            return;
        }

        res.status(200).send('Kategória törölve!');
        return;

    });
})
//Kategória módosítása
app.patch('/changeCat/:id', (req, res) =>{
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!')
        return;
    }
    if(!req.body.name){
        res.status(203).send('Nem adott meg nevet!')
    }
    pool.query(`UPDATE categories SET name = '${req.body.name}' WHERE categories.ID = '${req.params.id}'`, (err, results)=>{    
    if(err){
        res.status(500).send('Hiba történt az adatbázis lekérése közben!');
        return;
    }
    if(results.affectedRows == 0){
        res.status(203).send('Hibás az azonosító!');
        return;
    } 
    res.status(200).send('Kategória módosítva!');
    return;})
})

//Kép feltöltés

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }

    let image = req.files.image;
    let uploadDir = path.join(__dirname, 'uploads');

    // Ellenőrizd, hogy a könyvtár létezik-e, ha nem, hozd létre
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    let uploadPath = path.join(uploadDir, image.name);

    image.mv(uploadPath, function(err) {
        if (err) {
            console.log('File upload error:', err);
            return res.status(500).send('Nem sikerölt feltölteni a képet!');
        }

        // Mentés az adatbázisba
        pool.query(`INSERT INTO images (filename) VALUES ('${image.name}')`, (err, results) => {
            if (err) {
                return res.status(500).send('Hiba történt az adatbázis művelet közben!');
            }
            res.send('File uploaded and saved to database!');
        });
    });
});


//sunyin hallgatózik

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
PATCH /users/:id - felhasználó adatainak módosítása
PATCH /passmod/:Id - jelszóváltoztatás
DELETE /users/:id - adott idjű user törlése (admin)

*/