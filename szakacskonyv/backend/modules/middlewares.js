// MIDDLEWARE functions
const db = require('./database');

// bejelentkezés (legyé bejelentkezve különben kapod)

function logincheck(req, res, next) {
    let token = req.header('Authorization');
    if(!token) {
        res.status(400).send('Jelentkezz be!');
        return;
    }

    db.query(`SELECT * FROM users WHERE ID='${token}'`, (err, results) => {
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

    db.query(`SELECT role FROM users WHERE ID='${token}'`, (err, results) => {
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

module.exports = {
    logincheck,
    admincheck
}