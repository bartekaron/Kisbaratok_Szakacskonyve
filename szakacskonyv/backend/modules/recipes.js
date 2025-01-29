const express = require('express');
const router = express.Router();
const db = require('./database');
const { admincheck } = require('./middlewares');




//Összes recept
router.get('/', (req, res) => {
    db.query(`SELECT ID, catID, userID, title, descp, time, additions, calorie FROM recipes`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    });
})
//Recept Id alapján
router.get('/:id', (req, res) => {
    db.query(`SELECT ID, catID, userID, title, descp, time, additions, calorie FROM recipes WHERE ID = '${req.params.id}'`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    });
})
router.delete('/delRecipie/:id' , (req,res) =>{
    db.query(`DELETE FROM recipes WHERE ID='${req.params.id}'`, (err, results) => {

        if(err){
            res.status(500).send('Hiba történt az adatbázis lekérése közben!');
            return;
        }

        if(results.affectedRows == 0){
            res.status(203).send('Hibás az azonosító!');
            return;
        }

        res.status(200).send('Recept törölve!');
        return;

    });
})
//Recept módosítás
router.patch('/changeRecipie/:id', (req, res) => {
    if (!req.body.title || !req.body.descp || !req.body.additions || !req.body.calorie) {
        res.status(203).send('Nem adott meg valamit!');
        return;
    }
    const query = `
        UPDATE recipes 
        SET title = ?, descp = ?, additions = ?, calorie = ? 
        WHERE ID = ?
    `;
    const values = [req.body.title, req.body.descp, req.body.additions, req.body.calorie, req.params.id];
    
    db.query(query, values, (err, results) => {
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérése közben!');
            return;
        }
        if (results.affectedRows == 0) {
            res.status(203).send('Hibás az azonosító!');
            return;
        }
        res.status(200).send('Recept módosítva!');
    });
});

// Statisztikák
router.get('/statistics', admincheck, (req, res) => {
    const stats = {};

    // Felhasználók számának lekérdezése
    db.query(`SELECT COUNT(*) AS userCount FROM users`, (err, userResults) => {
        if (err) {
            return res.status(500).send('Hiba történt az adatbázis elérése közben!');
        }
        stats.userCount = userResults[0].userCount;

        // Receptek számának lekérdezése
        db.query(`SELECT COUNT(*) AS recipeCount FROM recipes`, (err, recipeResults) => {
            if (err) {
                return res.status(500).send('Hiba történt az adatbázis elérése közben!');
            }
            stats.recipeCount = recipeResults[0].recipeCount;

            // Kategóriákra bontott receptek számának lekérdezése és a kategóriák neveinek lekérdezése
            db.query(`SELECT categories.name, COUNT(recipes.catID) AS recipeCount FROM categories LEFT JOIN recipes ON categories.ID = recipes.catID GROUP BY categories.ID`, (err, categoryResults) => {
                if (err) {
                    return res.status(500).send('Hiba történt az adatbázis elérése közben!');
                }
                stats.categories = categoryResults;

                res.status(200).send(stats);
            });
        });
    });
});

module.exports = router;