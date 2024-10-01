const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const User = require('../models/User');
const multer = require("multer");
const cloudinary = require('../cloudinaryConfig')
const {storage} = require("../cloudinaryConfig");
const upload = multer({storage});

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
    res.json(books);
  } catch (err) {
    console.error('Error getting books:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decodedToken = jwt.verify(token.split(' ')[1], "easy");
    const ownerId = decodedToken.userId; 
    
    const { title, author, desc, condition, buyPrice, rentPrice, availability, quantity } = req.body;

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const imageUrl = req.file.path;

    const book = new Book({
      title,
      author,
      desc,
      condition,
      buyPrice,
      rentPrice,
      availability: availability || true,
      quantity: quantity || 1,
      owner: owner,
      image: imageUrl
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({path: 'owner' });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], "easy");
    const ownerId = decodedToken.userId;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  try {
    const { id } = req.params;
    const { availability } = req.body;
    const decodedToken = jwt.verify(token.split(' ')[1], "easy");
    const ownerId = decodedToken.userId;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Book.findByIdAndUpdate(id, { availability });
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: error.message });
  }
};
