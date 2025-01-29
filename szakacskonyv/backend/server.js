require('dotenv').config();
var cors = require('cors');
const express = require('express');
const port = process.env.PORT;
const app = express();
const userRoutes = require('./modules/users');
const recipeRoutes = require('./modules/recipes');
const categoryRoutes = require('./modules/categories');


//kép
const path = require('path');
const fileUpload = require('express-fileupload');


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);

app.use(fileUpload());





// get API version
app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
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