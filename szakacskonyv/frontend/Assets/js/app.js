const serverUrl = 'http://localhost:3000'
let loggedUser;

async function render(view){
    let main = document.querySelector('main')
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text()
    
    switch(view){
        case 'profile':{
            getMyProfile()
            break
        }
        case 'users': {
            getUsers()
            break
        }
        case 'recipes': {
            loadRecipes();
            categoryLoad("#categorySelector");
            document.querySelector('#categorySelector').addEventListener('change', function() {
                const selectedCategory = this.value; // Get the selected category ID
                filterRecipesByCategory(selectedCategory);
            });
            break;
        }
        case 'addrecipes': {
            if (!loggedUser) {
                alert('Kérjük, jelentkezz be a receptek hozzáadásához.');
                render('login');
                return;
            }
            categoryLoad("#categoryChoser");
            break;
        }
        case 'category': {
            getCategories();
            break;
        }
        case 'statistics': {
            loadStatistics();
            break;
        }
    }
}

if (localStorage.getItem('receptEmber')){
    loggedUser = JSON.parse(localStorage.getItem('receptEmber'))
    render('recipes')
}else{
    render('login')
}


//Ez a nav itemeket változgatja, ha ez nem esett volna le a névből te büüüdös NOOB
function renderNavItems(){
    let lgdOutNavItems = document.querySelectorAll('.lgdOut')
    let lgdInNavItems = document.querySelectorAll('.lgdIn')
    let admNavItems = document.querySelectorAll('.lgdAdmin')

    // ha nem
    if (loggedUser == null){
        lgdInNavItems.forEach(item =>{
            item.classList.add('d-none')
        })
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none')
        })
        admNavItems.forEach(item => {
            item.classList.add('d-none')
        })
        return
    }
    //ha igen

        //ha én vagyok az admin
    if (loggedUser[0].role == 'admin'){
        admNavItems.forEach(item => {
            item.classList.remove('d-none')
        })
    }
        //ha büdös noob vagyok
    lgdInNavItems.forEach(item => {
        item.classList.remove('d-none')
    })
        // ha még Csokinál is nagyobb butafej vagyok
    lgdOutNavItems.forEach(item => {
        item.classList.add('d-none')
    })
}

document.addEventListener('DOMContentLoaded', logout());
//Megerősítés mert az elég kokszos boxos ❤
function authorize() {
    let res = {
        headers: {"Authorization": loggedUser[0].ID} 
    }
    return res
}
renderNavItems()


async function loadStatistics() {
    try {
        const response = await axios.get(`${serverUrl}/statistics`, authorize());
        const data = response.data;

        // Felhasználók számának frissítése
        document.getElementById('userCount').innerText = data.userCount;

        // Receptek számának frissítése
        document.getElementById('recipeCount').innerText = data.recipeCount;

        // Kategóriákra bontott receptek számának frissítése (opcionális)
        const categoriesDiv = document.createElement('div');
        categoriesDiv.innerHTML = '<h4>Kategóriák:</h4>';
        
        data.categories.forEach(category => {
            categoriesDiv.innerHTML += `<p>Kategória: <strong> ${category.name}</strong>, Receptek száma: <strong>${category.recipeCount}</strong></p>`;
        });

        // Hozzáadjuk a kategóriákhoz tartozó számokat a statisztikákhoz
        document.querySelector('.p-3').appendChild(categoriesDiv);
    } catch (error) {
        console.error('Hiba történt a statisztikák betöltésekor:', error);
    }
}

