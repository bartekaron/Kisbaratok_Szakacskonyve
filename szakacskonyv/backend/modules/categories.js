const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const db = require('./database');





// Kategória hozzáadása
router.post('/category', (req, res) => {
    if (!req.body.name) {
        res.status(400).send('A kategória neve kötelező');
        return;
    }
    const categoryId = uuid.v4();
    const categoryName = req.body.name;
    db.query('INSERT INTO categories (id, name) VALUES (?, ?)', [categoryId, categoryName], (err, results) => {
        if (err) {
            res.status(500).send('Hiba történt a kategória hozzáadása során');
            return;
        }
            res.status(200).send('Kategória sikeresen hozzáadva');
        return;
    });
});

//Összes kategória
router.get('/', (req, res) => {
    db.query(`SELECT ID, name FROM categories`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    })
});

//Recept hozzáadás
router.post('/addRecipe', (req, res) => {
    
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

    db.query(query, values, (err, results) => {
        if (err) {
            console.error(err); // Naplózza a hibát
            res.status(500).send('Hiba történt az adatbázis elérése közben!');
            return;
        }
        res.status(201).send('Recept sikeresen hozzáadva!');
    });
});

//Id alapján kategória
router.get('/:id', (req, res) => {
    db.query(`SELECT ID, name FROM categories WHERE ID='${req.params.id}'`, (err, results) => {
    if(err){
        res.status(500).send('Hiba történt az adatbázis elérése közben!');
        return;
    }
    res.status(200).send(results);
    return;
    });
})
//Kategória törlés
router.delete('/deleteCat/:id', (req, res) =>{
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    db.query(`DELETE FROM categories WHERE ID='${req.params.id}'`, (err, results) => {

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
router.patch('/changeCat/:id', (req, res) =>{
    if(!req.params.id){
        res.status(203).send('Hiányzó azonosító!')
        return;
    }
    if(!req.body.name){
        res.status(203).send('Nem adott meg nevet!')
    }
    db.query(`UPDATE categories SET name = '${req.body.name}' WHERE categories.ID = '${req.params.id}'`, (err, results)=>{    
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
module.exports = router;