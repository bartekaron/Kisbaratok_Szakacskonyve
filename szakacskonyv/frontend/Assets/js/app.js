const serverUrl = 'http://localhost:3000'
let loggedUser = null

async function render(view){
    let main = document.querySelector('main')
    main.innerHTML = await (await fetch(`Views/${view}.html`)).text()
    
    //Ne félj a switch case-től nem bánt, sőt kisbarátok vagytok! 
    switch(view){
        case 'profile':{
            getMyProfile()
            break
        }
        case 'users': {
            getUsers()
            break
        }
       
    }
}
//Ez csak egy if else mert ha bevan jelentkeze akkor nagyon fasza gyerek
if (localStorage.getItem(/*Ő a fiad ->*/'receptEmber'  )){
    loggedUser = JSON.parse(localStorage.getItem('receptEmber'))
    render('recipes')
}else{
    render('login')
}

//Ez a nav itemek változgatja, ha ez nem esett volna le a névből te büüüdös NOOB
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

//Megerősítés mert az elég kokszos boxos ❤
function authorize() {
    let res = {
        headers: {"Authorization": loggedUser[0].ID} 
    }
    return res
}
renderNavItems()
