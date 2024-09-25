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
    
    axios.get(`${serverUrl}/categories`, authorize()).then(res => {
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
    console.log(data);
    axios.post(`${serverUrl}/addRecipe`, data).then(res => {
        console.log(res.data);
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
    axios.get(`${serverUrl}/categories`, authorize()).then(res => {
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



