const router = require('express').Router();
const authController = require('../../controllers/hdm/authController');

router.post('/login', authController.login);

module.exports = router;