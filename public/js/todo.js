const API_URL = '/api/todos';

const form = document.getElementById('todoForm');
const titleInput = document.getElementById('todoTitle');
const todoListEl = document.getElementById('todoList');
const progressBar = document.getElementById('progressBar');
const percentageText = document.getElementById('percentageText');
const summaryText = document.getElementById('summaryText');
const errorDiv = document.getElementById('errorMessage');

let errorTimeout;

function showError(message) {
    clearTimeout(errorTimeout);
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden', 'hide');
        
        requestAnimationFrame(()=> {
            requestAnimationFrame(() => {
                errorDiv.classList.add('show');
            });
        });
        errorTimeout = setTimeout (() => {
            hideError()
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

//untuk format tanggal YYY-MM-DD
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

let currentDate = getTodayDate();

//ambil dan tampilkan semua todo yang ada 
async function loadTodos() {
    const res = await fetch(`${API_URL}/date/${currentDate}`);
    const data = await res.json();

    if(!res.ok) {
        showError(data.error);
        return;
    }

    const {todos, total, completed , percentage} = data;

    //update progress bar 
    progressBar.style.width = `${percentage}%`;
    percentageText.textContent = `${percentage}%`;
    summaryText.textContent = `${completed} dari ${total} kegiatan selesai `;

    //render data list Todo dari db 
    todoListEl.innerHTML = "";

    if(todos.length === 0) {
        todoListEl.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Belum ada kegiatan hari ini. Tambahkan untuk yang Pertama dihari ini!</p>`
        return;
    }

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'flex item-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50';

        li.innerHTML = `<input type="checkbox" class="toggle w-5 h-5 accent-green-500 cursor-pointer" ${todo.is_done ? 'checked' : ''}>
        <span class="flex-1 ${todo.is_done ? 'line-through text-gray-400' : 'text-gray-800'}">${todo.title}</span>
        <button class="delete text-red-400 hover:text-red-600 text-sm">Hapus</button>
        `;

        li.querySelector('.toggle').addEventListener('change' , async () => {
            await fetch(`${API_URL}/${todo.id}/toggle`, {method: 'put'});
            loadTodos();
        });

        li.querySelector('.delete').addEventListener('click', async () => {
            await fetch(`${API_URL}/${todo.id}`, {method : 'delete'});
            loadTodos();
        });

        todoListEl.appendChild(li);
    });
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const title = titleInput.value;

    const res = await fetch(API_URL, {
        method : 'post',
        headers : {'content-type' : 'application/json'},
        body : JSON.stringify({title, todoDate : currentDate}),
    });


    const data = await res.json();

    if(!res.ok) {
        showError(data.error);
        return;
    }

    titleInput.value = '';
    loadTodos();
})

//logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('./api/auth/logout', {method : 'post'});
    window.location.href = './login.html';
});

//muat todo saat pertama kali di buka pagenya 
loadTodos();