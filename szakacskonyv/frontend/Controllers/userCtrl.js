const serverUrl = 'http://localhost:3000';

async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text();
    
}

if (localStorage.getItem('receptEmber')){
    loggedUser = JSON.parse(localStorage.getItem('receptEmber'));
    render('recipie');
}else{
    render('login');
}