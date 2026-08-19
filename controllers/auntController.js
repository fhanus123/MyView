const bcrypt = require('bcrypt');
const accountModel = require('../models/accountModel');

async function reqister(req, res) {
    try {
        const {username, password , role } = req.body;

        if(!username || username.trim() === '') {
            return res.status(400).json({error: 'username tidak boleh kosong'});
        }
        if(!password || password.length < 6) {
            return res.status(400).json({error : 'pasword minimal 6 karakter'});
        }

        const account = await accountModel.createAccount(username, password, role || 'user');
        res.status(201).json({message : 'Akun berhasil dibuat ', account});
    } catch(err) {
        res.status(400).json({error : err.message});
    }
}

async function login(req, res) {
    try {
        const {username, password} = req.body;

        if(!username || !password ) {
            return res.status(400).json({error : 'username dan password wajib diisi '});
        }
        
        const account = await accountModel.findByUsername(username);
        if(!account) {
            return res.status(401).json({error: 'Username dan password anda salah '});
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if(!isMatch) {
            return res.status(401).json({error : 'password yang anda masukan salah '});
        }

        // simpan data yang ada ke session 
        req.session.userId = account.id;
        req.session.username = account.username;
        req.session.role =  account.role;

        res.json({message: 'Login berhasil', role : account.role});
    } catch (err) {
        res.status(500).json({message : err.message});
    }
}

async function getAllAccounts(req, res) {
    try {
        const accounts = await accountModel.getAllAccounts();
        res.json(accounts);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

async function deleteAccount(req, res) {
    try{
        const {id} = req.params;

        //keamanan agar admin tidak menghapus diri sendiri
        if(parseInt(id) == req.session.userId) {
            return res.status(404).json({error : 'anda tidak bisa menghapus akun anda sendiri'})
            
        }
        
        const changes = await accountModel.deleteAccount(id);
        if(changes == 0) {
            return res.status(404).json({error: 'akun tidak ditemukan'});
        }
        
        res.json({message : 'Akun berhasil dihapus'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

async function resetPassword(req, res) {
    try{
        const {id} = req.params;
        const {newPassword} = req.body;

        if(!newPassword || newPassword.length < 6) {
            return res.status(400).json({error: 'password minimal harus 6 karakter'});
        }

        const changes = await accountModel.resetPassword(id, newPassword);
        if(changes == 0) {
            return res.status(404).json({error: 'Akun tidak ditemukan'})
        }
        res.json({message: 'Password berhasil direset'});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({error : 'gagal logout'});
        }
        res.clearCookie('connect.sid'); //untuk menghapus cookie dari browsure jika user logout
        res.json({message : 'logout berhasil!'});
    });
}

function checkAuth(req, res) {
    if(req.session.userId) {
        res.json({
            loggedIn : true,
            username : req.session.username,
            role : req.session.role
        });
    } else {
        res.json({loggedIn: false});
    }
}

module.exports = {reqister, login, resetPassword, deleteAccount, logout, getAllAccounts, checkAuth};

// ada sedikit penjelasan 
// bcrypt.compare(password, account.password); ini berfungsi untuk mencocokan password yang diketi user dan di acak mengunakna hash
// dan juga kita membuat pesannya di generalisir mau di bagian user atau password error yang di tampilkan sama, agar orang tidak tau pasti yang slaah mereka itu username atau sandi ( standar keamanan)
// checkAuth adlaah endpoint untuk frontend mengecheck apakah user sedang login di waktu ini. dan akan berguna nantinya jika kita membuat redirect otomatis
