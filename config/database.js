const sqlite3 = require('sqlite3').verbose(); // disini kegunaan .verbode() untuk mengaktifkan stack trance yang lebih panjang yang berguna menampilkan pesan error lebih detail

//membuat file database.db kalu belum ada
const db = new sqlite3.Database('./database.db', (err) =>{
    if(err) {
        console.log('gagal connection ke database:',err.message);
    } else {
        console.log('berhasil terhubung ke database')
    }
});

// //sqlite3.Database('./database.db', ...) → membuka (atau membuat) file database bernama database.db

// CREATE TABLE IF NOT EXISTS → bikin tabel users kalau belum ada, supaya tidak error kalau dijalankan berkali-kali

// module.exports = db → supaya file lain (controller) bisa "pinjam" koneksi database ini


// membuat tabbel user di dbnya
db.run(`
    create table if not exists users (
    id integer primary key autoincrement,
    name text not null,
    email text not null unique, 
    created_at datetime default current_timestamp
    )
`);
 // kalimat unique bertugas untuk mencegah adanya duplikasi email yang masuk ke database 
 // kalimat unique bertugas untuk mencegah adanya duplikasi email yang masuk ke database 
 //dan no null berfungsi untuk mencegah user memasukan name dan email yang kosong 

 
db.run(`
    create table if not exists accounts (
    id integer primary key autoincrement,
    username text not null unique,
    password text not null,
    role text not null default 'user',
    created_at datetime default current_timestamp
    )
`);

db.run(`
    create table if not exists todos (
        id integer primary key autoincrement,
        account_id integer not null,
        title text not null,
        is_done integer not null default 0,
        todo_date date not null default (date('now')),
        created_at datetime default current_timestamp,
        foreign key (account_id) references account(id)
    )
    `);
// sccount_id menyimpan "milik siapa" ( untuk memisahkan data setiap user). dan juga ini terhubung ke table account dan ini di sebeut foreign key yaitu cara menghubungkan kedua table database yang berbeda
//is_done adalah variabel yang menenetukan apakah task hari ini sudah selesai atau belum ( karena sql tidak punya boolean maka kita mengunakan angka 0 dan 1 )
//dan todo_date adalah tempat menyimpan otomatis tanggal hari ini ( realtime ) yang di set di (date('now)), dan dipakai untuk filter "apa yang ingin di lakukan hari ini " 
module.exports = db; // ini berfungsi untuk mengeksport connection databasenya agar bisa di gunakan kembali di file lainnya 