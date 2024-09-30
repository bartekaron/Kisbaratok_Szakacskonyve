    
let iD;
let titlE;
let descP; 
let timE; 
let additionS; 
let caloriE; 

let kategoriak = [];
function categoryAdd(){ 
    let data = {
        name : document.querySelector('#categoryName').value
    };
    
   
    axios.post(`${serverUrl}/category`, data).then(res => {
        alert(res.data);
       
    });
    getCategories()
        
}

function categoryLoad(ID){
    
  
    const categorySelector = document.querySelector(ID);
    
    axios.get(`${serverUrl}/categories`).then(res => {
        kategoriak = res.data; // Assign the array directly
       
        
        for (let i = 0; i < kategoriak.length; i++) {
            const option = document.createElement('option');
            option.value = kategoriak[i].ID;
            option.text = kategoriak[i].name;
            categorySelector.appendChild(option);
        }
    });

}
function recipeAdd(){
    const categoryChoser = document.querySelector('#categoryChoser').value;
    let data = {
        
        catID : categoryChoser,
        userID : loggedUser[0].ID,
        title : document.querySelector('#recipeTitle').value,
        descp : document.querySelector('#recipeDesc').value,
        time: document.querySelector('#recipeTime').value,
        additions : document.querySelector('#recipeAdditions').value,
        calorie : document.querySelector('#recipeCalorie').value
    };
    axios.post(`${serverUrl}/addRecipe`, data).then(res => {
        alert(res.data);
    });
 
}

function renderCategories(categories){
    
    let tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    categories.forEach(category => {
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td7 = document.createElement('td')
        
        td1.innerHTML = '#'
        td2.innerHTML = category.name
        
       
        let btn1 = document.createElement('button')
        let btn2 = document.createElement('button')
        btn1.innerHTML = 'Módosítás'
        btn1.classList.add('btn','btn-warning', 'btn-sm', 'me-2')
        btn2.innerHTML = 'Törlés'
        btn2.classList.add('btn','btn-danger', 'btn-sm')
        td7.classList.add('text-end')
        btn1.onclick = function() {editCategories(category.ID)}
        btn2.onclick = function() {deleteCategories(category.ID)}
        td7.appendChild(btn1)
        td7.appendChild(btn2)   
        

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td7)

        tbody.appendChild(tr)
    })

    let total = document.querySelector('strong')
    total.innerHTML = categories.length
}




function getCategories(){
    axios.get(`${serverUrl}/categories`).then(res => {
        renderCategories(res.data)
    })
}


function deleteCategories(ID){
    if (confirm('Tuti?')){
        axios.delete(`${serverUrl}/deleteCat/${ID}`, authorize()).then(res => {
            if (res.status == 200){
                getCategories()
            }
        })
    }
}   
//Frissíti
function updateCategories(ID){
    let data = {
        name: document.querySelector('#name').value
    }
    
    axios.patch(`${serverUrl}/changeCat/${ID}`, data, authorize()).then(res => {
        if (res.status == 200){
            render('category')
        }
    })
    
}


function editCategories(ID){    
    render('editcategories').then(()=>{
            axios.get(`${serverUrl}/categories/${ID}`, authorize()).then(res => {
                document.querySelector('#name').value = res.data[0].name
                document.querySelector('#updaBtn').onclick = function() {updateCategories(ID)}
            })
    })
    
    
}

let recipesData = [];

// Function to load recipes from the server and populate recipesData
async function loadRecipes() {
    try {
        const response = await axios.get(`${serverUrl}/recipes`);
        recipesData = response.data;  // Populate recipesData with the response data
        const recipesList = document.getElementById('recipes-list');
        recipesList.innerHTML = ''; 

        recipesData.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'col-md-4 mb-4';
            recipeItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><strong>Név:</strong> ${recipe.title}</h5>
                        <p class="card-text"><strong>Leírás:</strong> ${recipe.descp}</p>
                        <p class="card-text"><strong>Elkészítési idő:</strong> ${recipe.time} perc</p>
                        <p class="card-text"><strong>Hozzávalók:</strong> ${recipe.additions}</p>
                        <p class="card-text"><strong>Kalória:</strong> ${recipe.calorie} kcal</p>
                        ${loggedUser &&(loggedUser[0].role == 'admin' || loggedUser[0].ID == recipe.userID) ? `
                        <button class="btn btn-primary" onclick="openForm('${recipe.ID}')">Módosít</button>
                        <button class="btn btn-danger" onclick="deleteRecipe('${recipe.ID}')">Töröl</button>
                        ` : ''}
                    </div>
                </div>
            `;
            recipesList.appendChild(recipeItem);
        });
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
   
}
function openForm(recipeID) {
    const recipe = recipesData.find(r => r.ID === recipeID);
    document.getElementById("myModify").style.display = "block";
    document.getElementById("titlE").value = recipe.title;
    document.getElementById("descriptioN").value = recipe.descp;
    document.getElementById("timE").value = recipe.time;
    document.getElementById("additionS").value = recipe.additions;
    document.getElementById("caloriE").value = recipe.calorie;
}


function deleteRecipe(ID) {
    if (confirm('Tuti?')) {
        axios.delete(`${serverUrl}/delRecipie/${ID}`, authorize())
            .then(res => {
                if (res.status === 200) {
                    loadRecipes();
                }
            })
            .catch(error => {
                console.error('Error deleting recipe:', error);
            });
    }
    console.log('Delete recipe with id:', ID);  // Ensure ID is used consistently
}






function modifyRecipe(ID) {

    titlE = document.querySelector('#titlE').value;
    descP = document.querySelector('#descriptioN').value;
    timE = document.querySelector('#timE').value;
    additionS = document.querySelector('#additionS').value;
    caloriE = document.querySelector('#caloriE').value;
   
    
    for (let i = 0; i < recipesData.length; i++) {
        if(titlE == recipesData[i].title){
            iD = recipesData[i].ID;
        }   
    }
    data = {
        title: titlE,
        descp: descP,
        time: timE,
        additions: additionS,
        calorie: caloriE
    }
    console.log(data);
    axios.patch(`${serverUrl}/changeRecipie/${iD}`, data, authorize()).then(res => {
        //alert(res.data);
        if (res.status == 200){
            render('recipes');
        }
    })
}
   
function closeForm() {
    document.getElementById("myModify").style.display = "none";
}


    
function filterRecipesByCategory(categoryId) {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = ''; // Clear the current displayed recipes

    // Check if the selected category is empty (Show All)
    if (categoryId === "") {
        // If "Show All" is selected, render all recipes
        recipesData.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'col-md-4 mb-4';
            recipeItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><strong>Név:</strong> ${recipe.title}</h5>
                        <p class="card-text"><strong>Leírás:</strong> ${recipe.descp}</p>
                        <p class="card-text"><strong>Elkészítési idő:</strong> ${recipe.time} perc</p>
                        <p class="card-text"><strong>Hozzávalók:</strong> ${recipe.additions}</p>
                        <p class="card-text"><strong>Kalória:</strong> ${recipe.calorie} kcal</p>
                        ${loggedUser && (loggedUser[0].role === 'admin' || loggedUser[0].ID === recipe.userID) ? `
                        <button class="btn btn-primary" onclick="openForm('${recipe.ID}')">Módosít</button>
                        <button class="btn btn-danger" onclick="deleteRecipe('${recipe.ID}')">Töröl</button>
                        ` : ''}
                    </div>
                </div>
            `;
            recipesList.appendChild(recipeItem); // Add the recipe to the displayed list
        });
    } else {
        // Filter recipes that match the selected category
        const filteredRecipes = recipesData.filter(recipe => recipe.catID === categoryId);

        // Render the filtered recipes
        filteredRecipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'col-md-4 mb-4';
            recipeItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><strong>Név:</strong> ${recipe.title}</h5>
                        <p class="card-text"><strong>Leírás:</strong> ${recipe.descp}</p>
                        <p class="card-text"><strong>Elkészítési idő:</strong> ${recipe.time} perc</p>
                        <p class="card-text"><strong>Hozzávalók:</strong> ${recipe.additions}</p>
                        <p class="card-text"><strong>Kalória:</strong> ${recipe.calorie} kcal</p>
                        ${loggedUser && (loggedUser[0].role === 'admin' || loggedUser[0].ID === recipe.userID) ? `
                        <button class="btn btn-primary" onclick="openForm('${recipe.ID}')">Módosít</button>
                        <button class="btn btn-danger" onclick="deleteRecipe('${recipe.ID}')">Töröl</button>
                        ` : ''}
                    </div>
                </div>
            `;
            recipesList.appendChild(recipeItem); // Add the recipe to the displayed list
        });
    }
}


//  <button class="btn btn-primary btn-sm" onclick="modifyRecipe('${recipe.ID}');openForm()">Módosít</button>