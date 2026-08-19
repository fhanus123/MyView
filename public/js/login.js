const form = document.getElementById('authForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('errorMessage');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleText = document.getElementById('toggleText');
const toggleModeBtn = document.getElementById('toggleModeBtn');

let errorTimeOut;
let isRegisterMode = false; //false itu login, true itu register  

function showError(message){
    clearTimeout(errorTimeOut);
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden', 'hide');

    requestAnimationFrame(() =>{
        requestAnimationFrame(() =>{
            errorDiv.classList.add('show');
        });
    });

    errorTimeOut = setTimeout(() => {
        hideError();
    }, 4000) 
}

function hideError() {
    errorDiv.classList.remove('show');
    errorDiv.classList.add('hide');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('hide');
    }, 300)
}

//toggle untuk modeBtn
toggleModeBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;

    if(isRegisterMode) {
        formTitle.textContent = 'Daftar Akun';
        submitBtn.textContent = 'Daftar';
        toggleText.textContent = 'Sudah Punya akun?';
        toggleModeBtn.textContent = 'Masuk';
    } else {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Masuk';
        toggleText.textContent = 'Belum punya akun?';
        toggleModeBtn.textContent = 'Daftar';
    }
    form.reset();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    if(isRegisterMode) {

        const res = await fetch('/api/auth/register', {
            method : 'post',
            headers : {'content-type' : 'application/json'},
            body : JSON.stringify({username, password, role: 'user'}), //untuk set setiap register adalah user bukan admin
        });

        const data = await res.json();

        if(!res.ok) {
            showError(data.error);
            return;
        }

        //ini untu auto login setelah registrasi ( daftar )
        await autoLogin(username, password);
    } else {

        //ini untuk auto login
        await autoLogin(username, password);
    }
});

async function autoLogin(username, password) {
    const res = await fetch('/api/auth/login', {
        method : 'post',
        headers : {'content-type' : 'application/json'},
        body : JSON.stringify({username, password}),
    });

    const data = await res.json();

    if(!res.ok) {
        showError(data.error);
        return;
    }

    if(data.role === 'admin') {
        window.location.href = '/index.html';
    } else {
        window.location.href = '/todolist.html';
    }
}

//window.location.href adlaah cara javscript untuk mengarahkan ke halaman lain jika user melakukan suatu interaksi 