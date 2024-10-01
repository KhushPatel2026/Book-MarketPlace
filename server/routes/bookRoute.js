const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require("multer");
const {storage} = require("../cloudinaryConfig");
const upload = multer({storage});
const wrapAsync = require("../utils/wrapAsync.js");
const {verifyToken} = require("../middleware.js")

router.get('/', wrapAsync(bookController.getAllBooks));
router.post('/addbook', verifyToken, upload.single('image'), wrapAsync(bookController.addBook));
router.get('/:id', wrapAsync(bookController.getBook));
router.put('/:id', wrapAsync(bookController.updateBook));
router.delete('/:id',verifyToken,wrapAsync( bookController.deleteBook));

module.exports = router;
