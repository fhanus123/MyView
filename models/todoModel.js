const db = require('../config/database');

//create untuk menambahkan todo untuk hari ini untuk user (update : bisa terima tanggal untuk kebiasaan) 
function createTodo(accountId, title, todoDate = null) {
    return new Promise((resolve, reject) => {
        const sql = todoDate ? `insert into todos (account_id, title, todo_date) values (?, ?, ?)` : `insert into todos ( account_id, title) values (?, ?)`;
        const params = todoDate ? [accountId, title, todoDate] : [accountId, title];

        db.run(sql, params, function(err) {
            if(err) {
                reject(err)
            } else {
                resolve({id : this.lastID, account_id : accountId, title,  is_done : 0});
            }
        });
    }); 
}

//read ambil semua todo hari ini , untuk user (update : bisa ambil todo di tanggal tertentu bukan hanya hari ini )
function getTodayTodos(accountId, date) {
    return new Promise((resolve, reject) => {
        const sql = `select * from todos where account_id = ? and todo_date = ? order by created_at asc`;
        db.all(sql, [accountId, date], (err, todos) => {
            if(err) {
                reject(err);
            } else {
                resolve(todos);
            }
        });
    });
}

// ringkasan per hari dalam satu bulan (untuk mewarnai kalender )
function getMonthSummary(accountId, yearMonth) {
    return new Promise((resolve, reject) => {
        const sql = `
        select todo_date,
        count(*) as total,
        sum(is_done) as completed from todos where account_id = ? and todo_date like ? group by todo_date
        `;

        db.all(sql, [accountId, `${yearMonth}%`], (err, rows ) => {
            if(err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

//read kebiasaan yang paling sering ke-skip, dalam N hari terakhir
function getSkippedStats(accountId, days = 30) {
    return new Promise((resolve, reject) => {
        const sql = `
        select title,
        count(*) as total_muncul,
        sum(is_done) as total_selesai,
        (count(*) - sum(is_done)) as total_skip
        from todos where account_id = ? and todo_date >= date('now', '-' || ? || 'days')
        group by title
        having total_muncul > 1
        order by total_skip desc
        `;

        db.all(sql, [accountId, days], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


//update untuk penanda apakah task sudah selesai atau belum 
function toggleTodo(id, accountId) {
    return new Promise((resolve, reject) => {
        //tips pakai not is_done supaya otomatis mengisi nilai ( default is_done = 0 , jadi kalo "not is_done = 1")
        const sql = `update todos set is_done = not is_done where id = ? and account_id = ?`;
        db.run(sql, [id,accountId], function(err) {
            if(err){
                reject(err)
            } else {
                resolve(this.changes);
            }
        });
    });
}

//delete untuk menghapus todo yang diinginkan
function deleteTodo(id, accountId) {
    return new Promise((resolv, reject) => {
        const sql = `delete from todos where id = ? and account_id = ?`;
        db.run(sql, [id, accountId], function(err) {
            if(err){
                reject(err);
            } else {
                resolv(this.changes);
            }
        });
    });
}


module.exports = {createTodo, getTodayTodos, getMonthSummary, getSkippedStats, toggleTodo, deleteTodo}

//bisa kita perhatikan di function toggletodo dan deletetodo, di mana querya selalu menyertakan account_id di kondisi where, bukan cuman menyertakan id saja. ini mencegah
//user yang iseng menghapus/mengubah todo dari user B ( kemungkinan dari mengakses melalui api atau dari devOps). dan meskipun di tau idnya tidak akan berpengaruh. karena
//dia membutuhkan id dan account_id yang sama agar bisa mengakses nya.

//(update)
//group by todo_date bertugas mengelompokan baris berdasarkan tanggal (filter), lalu di count(*) dan sum(is_done) dihitug perekelompok, yang membuat
//setiap baris menampilkan ringkasan pertangal bukan per todo

//like ? dan {yearMonth}% bertugas mencocokan tanggal sehingga membuat rantai contoh 2020-8-01 - 2020-8-02 dan tanda % bertugas sebagai rantai penghubung untuk setiap tanggal
//date('now), '-' || ? || 'days') membuat tanggal di sql untuk bisa mengecheck tanggal sebelum hari N dari sekarang 
//dan || adalah operator untuk mengabungkan string di sql ( bukan or kalo di aritmatika umum bahasa pemograamn)

//having total_muncul > 1 memiliki kemiripan dengan where, tetapi dia khusus digunakan di group by, untuk memfilter hasil kelompok (misal, menampilkan kebiasaan yang sudah muncul lebih dari sekali atau kebiasan yang sering diskip)
