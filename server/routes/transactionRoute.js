const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {verifyToken} = require("../middleware.js")
const wrapAsync = require('../utils/wrapAsync');

router.get('/recent-transactions',  wrapAsync(transactionController.fetchRecentTransactions));
router.post('/create-checkout-session', wrapAsync(transactionController.createCheckoutSession));
router.post('/complete-payment', wrapAsync(transactionController.completePayment));

module.exports = router;
