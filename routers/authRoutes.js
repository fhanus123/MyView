const express = require('express');
const router = express.Router();
const authController = require('../controllers/auntController');
const {requireAdmin} = require('../midleware/authMidleware');

router.post('/register', authController.reqister);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);
router.get('/accounts', requireAdmin, authController.getAllAccounts);
router.delete('/accounts/:id', requireAdmin, authController.deleteAccount);
router.put('/accounts/:id/reset-password', requireAdmin, authController.resetPassword);

module.exports = router;