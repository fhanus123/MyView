const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const {requireLogin} = require('../midleware/authMidleware');

router.post('/todos', requireLogin, todoController.create);
router.get('/todos/date/:date', requireLogin, todoController.getByDate);
router.get('/todos/summary/:yearMonth', requireLogin, todoController.getSummary);
router.get('/todos/stats', requireLogin, todoController.getStats)
router.put('/todos/:id/toggle', requireLogin, todoController.toggle);
router.delete('/todos/:id', requireLogin, todoController.remove);

module.exports = router;

//kita mengunakan requireLogin (bukan reuireAdmin) kareba fitur ini akan digunakan oleh semua user yang sudah login, baik user umum atau admin