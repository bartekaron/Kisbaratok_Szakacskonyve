let kategoriak = [];
function categoryAdd(){ 
    let data = {
        name : document.querySelector('#categoryName').value
    };
    
   
    axios.post(`${serverUrl}/category`, data).then(res => {
        alert(res.data);
        
    });

    
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
    const img = document.querySelector('#upLoadForm');
    let data = {
        
        catID : categoryChoser,
        userID : loggedUser[0].ID,
        title : document.querySelector('#recipeTitle').value,
        descp : document.querySelector('#recipeDesc').value,
        time: document.querySelector('#recipeTime').value,
        additions : document.querySelector('#recipeAdditions').value,
        calorie : document.querySelector('#recipeCalorie').value,
        imgID: img
    };

    axios.post(`${serverUrl}/addRecipe`, data).then(res => {
        console.log(res.data);
    });
    
    
}





