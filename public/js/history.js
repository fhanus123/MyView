const API_URL = '/api/todos'

const monthLabel = document.getElementById('monthLabel');
const calenderGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const dayDetail = document.getElementById('dayDetail');
const dayDetailTitle = document.getElementById('dayDetailTitle');
const dayDetailList = document.getElementById('dayDetailList');
const statsList = document.getElementById('statsList');

const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

//state untuk bulan dan tahun yang sedang di tampilkan 
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // valeu nya ini 0 - 11 maka nanti harus + 1

function pad(n) {
    return String(n).padStart(2, '0');
}

// render kalender untuk bulan dan tahun tertentu 
async function renderCalendar() {
    monthLabel.textContent = `${namaBulan[currentMonth]} ${currentYear}`;

    const yearMonth = `${currentYear}-${pad(currentMonth + 1)}`;
    const res = await fetch (`${API_URL}/summary/${yearMonth}`);
    const summary = await res.json();

    //conver array summary menjadi sebuah object agar lebih muda dicari
    const summaryMap = [];
    summaryMap.forEach((row) => {
        summaryMap[row.todo_date] = row;
    });

    const firstDay = new Date(currentYear, currentMonth, 1);
    const startWeekday = firstDay.getDay(); // 0 = minggu
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    calenderGrid.innerHTML = '';

    //kotak kosong sebelum tanggal 1 ( supaya grid rata dan rapi)
    for (let i = 0 ; i < startWeekday; i++) {
        calenderGrid.innerHTML += `<div></div>`;
    }

    //kotak untuk tiap tanggal di bulan ini 
    for(let date = 1; date <= daysInMonth; date++) {
        const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(date)}`;
        const dayData = summaryMap[dateStr];

        let bgColor = 'bg-gray-100 text-gray-400';
        if(dayData) {
            const percentage = dayData.total === 0 ? 0 : Math.round((dayData.completed / dayData.total) * 100);
            if(percentage === 100) {
                bgColor = 'bg-green-500 text-white';
            } else if (percentage > 0 ) {
                bgColor = 'bg-yellow-300 text-gray-800';
            } else {
                bgColor = 'bg-req-200 text-gray-700';
            }
        }

        const cell = document.createElement('button');
        cell.className = `${bgColor} rounded p-2 text-sm hover:opacity-80 transition-opacity`;
        cell.textContent = date;

        cell.addEventListener('click', () => {
            showDayDetail(dateStr);
        })
        calenderGrid.appendChild(cell);
    }
}

//klik tanggal tertentu dan tanggal itu akan memberikan detail todo di tanggal itu 
async function showDayDetail(dateStr) {
    const res = await fetch(`${API_URL}/date/${dateStr}`);
    const data = await res.json();

    dayDetail.classList.remove('hidden');
    dayDetailTitle.textContent = `kegiatan pada ${dateStr}`;
    dayDetailList.innerHTML = '';

    if(data.todos.length === 0) {
        dayDetailList.innerHTML = `<li class="text-gray-400 text-sm">Tidak ada Kegiatan yang Tercatat.</li>`;
        return;
    }

    data.todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = `text-sm flex item-center gap-2`;
        li.innerHTML =`
        <span>${todo.is_done ? '✅' : '❌'}</span>
        <span class="${todo.is_done ? 'text-gray-800' : 'text-gray-400 line-through'}">${todo.title}</span>`;
        dayDetailList.appendChild(li);
    });
}

//ambil dan tampilkan statik kebiasaan yang sering di skip 
async function loadStats() {
    const res = await fetch(`${API_URL}/stats?days = 30`);
    const stats = await res.json();

    statsList.innerHTML = '';

    if(stats.length === 0) {
        statsList.innerHTML = `<p class="text-gray-400 text-sm">Belum cukup data untuk menampilkan statistik</p>`;
        return;
    };

    stats.forEach((item) => {
        const skipRate = Math.round((item.total_skip / item.total_muncul) * 100);

        const div = document.createElement('div');
        div.className = `flex justify-between items-center text-sm`;
        div.innerHTML = `
        <span class="text-gray-700">${item.title}</span>
        <span class="text-gray-500">${item.total_skip}x terlewat dari ${item.total_muncul}x (${skipRate}%)</span>
        `;
        statsList.appendChild(div);
    });
}

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if(currentMonth < 0 ) {
        currentMonth = 11;
        currentYear--;
    } 
    dayDetail.classList.add('hidden');
    renderCalendar();
});

//navigasi untuk bulan berikutnya 
nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if(currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } 
    dayDetail.classList.add('hidden');
    renderCalendar();
});

// muat ulang setiap page pertama kali dibuka
renderCalendar();
loadStats();

//new Date(currentYear, currentMonth + 1, 0) code ini bertugas