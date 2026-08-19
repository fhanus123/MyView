📋 Habit Tracker — Belajar Membangun Aplikasi dari Nol

Aplikasi web sederhana untuk mencatat kegiatan harian dan memantau kebiasaan (habit), lengkap dengan sistem login, role admin/user, dan riwayat progress dalam bentuk kalender.

🎯 Kenapa Saya Membuat Ini

Saya membuat project ini sebagai media belajar membangun aplikasi web dari nol — mulai dari nol pengalaman membangun aplikasi penuh, hanya bermodal pengetahuan dasar JavaScript dan Java.

Awalnya project ini cuma latihan CRUD sederhana. Tapi seiring belajar, saya mulai menambahkan fitur nyata yang bisa dipakai sehari-hari: adik saya suka gym dan ingin mencatat kegiatan latihannya setiap hari sekaligus memantau progressnya. Jadi project belajar ini pun berkembang jadi aplikasi yang benar-benar dipakai di rumah, yang dimana saya membuat webnya bisa diakses di jaringan WiFi lokal.

Catatan penting: saya masih dalam proses belajar.Beberapa bagian kode mungkin belum mengikuti best practice sepenuhnya, dan saya masih terus memperbaiki serta menambah fitur seiring pemahaman saya bertambah. Kalau ada saran atau masukan, saya sangat terbuka untuk belajar lebih banyak lagi.

✨ Fitur

- 🔐 **Autentikasi** — login & register dengan password ter-enkripsi (bcrypt)
- 👥 **Role-based access** — admin mengelola akun, user fokus ke kegiatan pribadinya
- ✅ **Todo harian** — catat kegiatan tiap hari, lengkap dengan checkbox dan progress persentase
- 📅 **Kalender riwayat** — lihat histori kegiatan per bulan, dengan warna yang menunjukkan tingkat penyelesaian
- 📊 **Statistik kebiasaan** — lihat kegiatan apa saja yang paling sering terlewat
- 🛠️ **Panel admin** — kelola akun terdaftar, reset password, hapus akun

🧱 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Frontend:** HTML, JavaScript (vanilla), Tailwind CSS v4
- **Autentikasi:** express-session, bcrypt

Project ini disusun dengan pola **MVC (Model-View-Controller)** — pola dasar yang saya pelajari untuk memisahkan tanggung jawab tiap bagian kode, supaya lebih mudah dipahami dan dikembangkan.

🚀 Cara Menjalankan

bash
# Install dependencies
npm install

# Jalankan server
node server.js

# (Opsional) Build Tailwind CSS di terminal terpisah
npx @tailwindcss/cli -i ./src/input.css -o ./public/css/style.css --watch

Buka `http://localhost:3000` di browser.

## 📚 Yang Saya Pelajari dari Project Ini

- Fundamental REST API & pola MVC
- Asynchronous JavaScript (callback → Promise → async/await)
- Autentikasi berbasis session & hashing password
- Debugging sistematis (banyak sekali typo yang saya temukan sepanjang jalan 😅)
- Styling dengan Tailwind CSS
- Dasar keamanan aplikasi web (validasi input, proteksi akses data antar user)

*Project ini terus berkembang seiring saya belajar. Terima kasih sudah mampir!*