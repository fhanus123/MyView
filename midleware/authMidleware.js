function requireLogin(req, res ,next) {
    if(!req.session.userId) {
        return res.status(401).json({ error : 'anda harus login terlebih dahulu'});
    }

    next(); //lanjut ke controller berikutnya kalau sudah login 
}

function requireAdmin(req, res, next) {
    if(!req.session.userId) {
        return res.status(401).json({error : 'anda harus login terlebih dahulu'});
    }

    if(req.session.role !== 'admin') {
        return res.status(403).json({error: 'akses di tolak, hanya untuk admin'});
    }

    next();
}

module.exports = {requireLogin, requireAdmin};

// code di sini berfungsi sebagai security atau verifikasi sebelum data yang di input masuk ke dalam controller