const express = require('express'); // memangil lib expres yang usdah diinstall
const session = require('express-session');
const db = require('./config/database');
const authRoutes = require('./routers/authRoutes');
const todoRoutes = require('./routers/todoRoutes');
const app = express();


const PORT = 3000; // jalan dari port program nanti 

app.use(express.json());// ini berfungsi agar express bisa baca data json dari request
app.use(session({
    secret :' ganti dengan text rahasia anda sendiri', //sintak untuk mengenkripsi cookie session
    resave : false, //jangan simpan ulang session ke storage kalu tidak ada perubahan( untuk optimasi)
    saveUninitialized : false, //jangan buat session jika masih kosong ( belum ada modifikasi dari login user)
    cookie : {
        maxAge: 1000 * 60 * 60 * 24, //set 1 hari ( dalam perhitungan milidetik) session bertahan di browser ( setelah lewat waktu maka sesion di hapus)
    }
}))
app.use(express.static('public', {index : false})); // ini berfungsi agar express bisa membaca file statis seperti gambar, css, js, dll

app.get('/', (req, res)=>{ // penjelasan parameter pertama itu menunjuk ke mana page yang ditampilkan pertama kali ketika program dijalankan
    //sedangkan nested function yang memiliki 2 parameter berfungsi sebagai :+
    //req (request) = parameter yang akan menyimpan argument dari user dan akan di kirim ke server. contohnya header, data form, parameter URl dan req.body(seperti name dan email)
    //res (response) = bertugas mengirimkan dat ayang didapatkan ke server, dan digunakan kembali untuk mengirimkan respon setelah server menerima data dari user
    res.redirect('/login.html')
});

app.use('/api/auth', authRoutes);
app.use('/api', todoRoutes);


app.listen(PORT, ()=>{// listen PORT menjalankan program di port 3000
    console.log(`server berjalan di http://localhost:${PORT}`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server sedang berjalan di http://localhost:${PORT}`);
});