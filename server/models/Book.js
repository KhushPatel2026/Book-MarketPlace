const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  desc:{
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  buyPrice: {
    type: Number,
    required: true
  },
  rentPrice: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
