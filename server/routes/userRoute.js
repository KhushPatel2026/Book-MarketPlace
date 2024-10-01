const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require("../middleware.js")
const wrapAsync = require('../utils/wrapAsync');

router.get('/user-details', wrapAsync(userController.getUserDetails));
router.get('/profile',  wrapAsync(userController.getUserProfile));
router.put('/profile', verifyToken, wrapAsync(userController.updateProfile));
router.get('/orders', verifyToken, wrapAsync(userController.getOrders));

module.exports = router;
