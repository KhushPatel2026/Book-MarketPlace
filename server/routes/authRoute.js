const express = require('express');
const authController = require('../controllers/authController');
const wrapAsync = require('../utils/wrapAsync');

const router = express.Router();

router.post('/register', wrapAsync(authController.register));
router.post('/login', wrapAsync(authController.login));
router.get('/logout', wrapAsync(authController.logout));

module.exports = router;
