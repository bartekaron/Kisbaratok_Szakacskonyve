// Nagyon regisztrálsz
function regisztracio(){
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        passwd: document.querySelector('#passwd').value,
        confirm: document.querySelector('#confirm').value
    }

    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data)
    })
}
// Belépsz, te bolond harcos
function login(){
    let user = {
        email: document.querySelector('#email').value,
        passwd: document.querySelector('#passwd').value
    }

    axios.post(`${serverUrl}/log`, user).then(res =>{
       
        if (res.status != 202){
            alert(res.data)
            return
        }

        loggedUser = res.data
        localStorage.setItem('receptEmber', JSON.stringify(loggedUser))
        renderNavItems()
        render('recipes')
    })
}
// Kilépsz 10/10es marha
function logout(){
    localStorage.removeItem('receptEmber')
    loggedUser = null
    renderNavItems()
    render('login')
}
//kapom a finom kis profilomat :3
function getMyProfile(){
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`, authorize()).then(res => {
        document.querySelector('#name').value = res.data[0].name;
        document.querySelector('#email').value = res.data[0].email;
        document.querySelector('#phone').value = res.data[0].phone;
    });
}

function UpdateProfile(){
    let data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        passwd: document.querySelector('#passwd').value
    };
    axios.patch(`${serverUrl}/users/${loggedUser[0].ID}`, data, authorize()).then(res => {
        alert(res.data);
    }).catch(err => {
        console.error(err);
        alert('Hiba történt a frissítés során.');
    });
}
//Az lekéri
function getUsers(){
    axios.get(`${serverUrl}/users`, authorize()).then(res => {
        renderUsers(res.data)
    })
}
//Ez kibassza a gecibe
function deleteUser(ID){
    if (confirm('Tuti?')){
        axios.delete(`${serverUrl}/users/${ID}`, authorize()).then(res => {
            alert(res.data)
            if (res.status == 200){
                getUsers()
            }
        })
    }
}
//Frissíti
function updateUser(ID){
    let data = {
        name: document.querySelectorAll('#name').value,
        email: document.querySelectorAll('#email').value,
        phone: document.querySelectorAll('#phone').value,
        passwd: document.querySelectorAll('#role').value
    }
    if(document.querySelector('#phone').value.length == 0){
        data.phone = "" 
    }
    axios.patch(`${serverUrl}/users/${ID}`, data, authorize()).then(res => {
        alert(res.data)
        if (res.status == 200){
            render('users')
        }
    })
}

function editUser(ID){
    render('edituser').then(()=>{
            axios.get(`${serverUrl}/users/${ID}`, authorize()).then(res => {
                document.querySelector('#name').value = res.data[0].name
                document.querySelector('#email').value = res.data[0].email
                document.querySelector('#phone').value = res.data[0].phone
                document.querySelector('#role').value = res.data[0].role
                document.querySelector('#updBtn').onclick = function() {updateUser(ID)}
            })
        })
    }

function renderUsers(users){
    let tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    users.forEach(user => {
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let td4 = document.createElement('td')
        let td5 = document.createElement('td')
        let td6 = document.createElement('td')
        
        td1.innerHTML = '#'
        td2.innerHTML = user.name
        td3.innerHTML = user.email
        td4.innerHTML = user.phone
        td5.innerHTML = user.role
        
        if (user.ID != loggedUser[0].ID){
            let btn1 = document.createElement('button')
            let btn2 = document.createElement('button')
            btn1.innerHTML = 'Módosítás'
            btn1.classList.add('btn','btn-warning', 'btn-sm', 'me-2')
            btn2.innerHTML = 'Törlés'
            btn2.classList.add('btn','btn-danger', 'btn-sm')
            td6.classList.add('text-end')
            btn1.onclick = function() {editUser(user.ID)}
            btn2.onclick = function() {deleteUser(user.ID)}
            td6.appendChild(btn1)
            td6.appendChild(btn2)   
        }

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)

        tbody.appendChild(tr)
    })

    let total = document.querySelector('strong')
    total.innerHTML = users.length
}