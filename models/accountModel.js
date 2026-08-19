const db = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10 // untuk set sepanjang apa hash untuk setiap password 

//function crae user mengunakan pasword yang sudah di ubah menjadi hash 
function createAccount(username, plainPassword, role = 'user') {
    return new Promise((resolv, reject) => {
        bcrypt.hash(plainPassword, SALT_ROUNDS, (err, hashedPassword) =>{
            if(err) {
                return reject(err);
            }
        const sql = 'insert into accounts (username, password, role) values (?, ?, ?)';
        db.run(sql, [username, hashedPassword, role], function (err) {
            if(err) {
                return reject(err);
            } else {
                resolv({id : this.lastID, username, role});
            }
        });
        });
    });
}

// search akun berdarsakan username 
function findByUsername(username) {
    return new Promise((resolv, reject) =>{
        const sql = `select * from accounts where username = ?`;
        db.get(sql, [username], (err, account) => {
            if (err) {
                reject(err);
            } else {
                resolv(account);
            }
        });
    });
}

function getAllAccounts() {
    return new Promise ((resolve, reject) => {
        const sql = `select id, username, role, created_at from accounts order by created_at desc`;
        db.all(sql, [] , (err, accounts) => {
            if(err) {
                reject(err);
            } else{
                resolve(accounts);
            }
        });
    });
}


//delete users
function deleteAccount(id) {
    return new Promise((resolve, reject) => {
        const deleteTodosAccounts = `delete from todos where account_id = ?`;
        db.run(deleteTodosAccounts, [id], (err) => {
            if(err) {
                reject(err);
            }    
            
            
            const deleteUserAccounts = `delete from accounts where id = ?`;
            db.run(deleteUserAccounts, [id], function(err){
                if(err){
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    });
}

//reset password akun
function resetPassword(id, newPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(newPassword, SALT_ROUNDS, (err, hashedPassword) => {
            if(err) {
                return reject(err)
            }

            const sql = `update accounts set password = ? where id = ?`;
            db.run(sql, [hashedPassword, id], function(err) {
                if(err) {
                    reject(err);
                }else {
                    resolve(this.changes);
                }
            });
        });
    });
}

module.exports = {createAccount, findByUsername, getAllAccounts, deleteAccount, resetPassword};