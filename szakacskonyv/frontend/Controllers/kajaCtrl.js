function categoryAdd(){ 
    let data = {
        name : document.querySelector('#categoryName').value
    }
    
   
    axios.post(`${serverUrl}/category`, data).then(res => {
        alert(res.data);
        
    });

    
}

function categoryLoad(){
    const kategoriak = [];
    const categorySelector = document.querySelector('#categorySelector');
    
    axios.get(`${serverUrl}/categories`, authorize()).then(res => { 
        console.log(res.data);
        //kategoriak.push(res.data);
        //alert(res.data);
    });

    for (let i = 0; i < kategoriak.length; i++) {
        const option = document.createElement('option');
        option.value = i.ID;
        option.text = i.name;
        categorySelector.appendChild(option);
        
    }

}

/*
 { 
        adatok = data;
        adatok.forEach(item => {
            

        });

*/ 

categoryLoad();


