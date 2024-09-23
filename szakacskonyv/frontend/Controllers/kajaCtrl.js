function categoryAdd(){ 
    let data = {
        name : document.querySelector('#categoryName').value
    }
    
   
    axios.post(`${serverUrl}/category`, data).then(res => {
        alert(res.data);
        
    });

    
}

function categoryLoad(){
    
    let kategoriak = [];
    const categorySelector = document.querySelector('#categorySelector');
    
    axios.get(`${serverUrl}/categories`, authorize()).then(res => {
        kategoriak = res.data; // Assign the array directly
        console.log(kategoriak);
        
        for (let i = 0; i < kategoriak.length; i++) {
            const option = document.createElement('option');
            option.value = kategoriak[i].ID;
            option.text = kategoriak[i].name;
            categorySelector.appendChild(option);
        }
    });

}

/*
 { 
        adatok = data;
        adatok.forEach(item => {
            

        });

*/ 




