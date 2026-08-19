async function checkAuth(requiredRole = null) {
    const res = await fetch('/api/auth/check');
    const data = await res.json();

    if(!data.loggedIn) {
        //jia belum login sama sekali maka di lempar ke tampilan login 
        window.location.href = '/login.html';
        return; 
    }

    if(requiredRole && data.role !== requiredRole) {
        //case jika sudah login tetapi rolenya tidak diizini akses ke halaman ini 
        alert('anda tidak memiliki akses ke halaman ini');
        window.location.href = '/login.html';
        return;
    }

    return data;
}

// kalo kita lihat function yang di sini bersifat reuse atau bisa di gunakan kembali.
//dan juga parameter function ini juga bersifat opsional yang berarti bisa dipangil dengan isi parameter admin untuk tampilan page admin atau user untuk halaman user
// atau tanpa paramater ( untuk memastikan)