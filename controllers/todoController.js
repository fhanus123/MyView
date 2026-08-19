const todoModel = require('../models/todoModel')

async function create(req, res) {
    try {
        const {title, todoDate}= req.body;
        if(!title || title.trim() === '') {
            return res.status(400).json({error : 'judul todo tidak boleh kosong'});
        }

        const accountId = req.session.userId;
        const todo = await todoModel.createTodo(accountId, title, todoDate);
        res.status(201).json({todo});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

async function getByDate(req, res) {
        try{
            const accountId = req.session.userId;
            const date  = req.params.date; // format yang di tampilkan YYYY-MM-DD

            const todos = await todoModel.getTodayTodos(accountId, date);

            const total = todos.length;
            const completed = todos.filter(t => t.is_done === 1).length;
            const percentage = total === 0 ? 0 : Math.round((completed/ total) * 100);
            res.json({todos, total, completed, percentage});
        } catch (err) {
            res.status(500).json({error : err.message});
        }
}

async function getSummary(req, res) {
    try {
        const accountId = req.session.userId;
        const yearMoth = req.params.yearMoth;

        const summary = await todoModel.getMonthSummary(accountId, yearMoth);
        res.json(summary);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getStats(req, res) {
    try{
        const accountId = req.session.userId;
        const days = req.query.days || 30;
        
        const stats = await todoModel.getSkippedStats(accountId, days);
        res.json(stats);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
}

async function toggle(req, res) {
    try {
        const accountId = req.session.userId;
        const userId = req.params.id;

        const change = await todoModel.toggleTodo(req.params.id, accountId);

        if (change === 0 ) {
            return res.status(404).json({ message : 'todo tidak ditemukan'});
        } 
        res.json({ message : 'status todo berhasil diperbarui'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


async function remove(req, res) {
    try {
        const accountId = req.session.userId;
        const userId = req.params.id;

        const change = await todoModel.deleteTodo(req.params.id, accountId);

        if(change === 0 ) {
            return res.status(404).json({error : 'todo tidak ditemukan'});
        }

        res.json({ message : 'todo berhasil dihapus'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = {create, getByDate, getStats, getSummary, toggle, remove};

//accountId selalu di ambil dari req.params.userId, dan bukan di ambil dari body, karena kalo kita ambil dari body maka orang lain juga bisa menyuntikan user password baru melalui postmand
//dan juga diabisa memanipulasikan todo user lainnya. dan juga session lebih bisa dipercaya karena hanay server yang bisa mengaksesnya dan mengisinya (saat login berhasi)