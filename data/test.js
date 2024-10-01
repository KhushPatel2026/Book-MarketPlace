const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB', error));

// Define the owner ObjectId
const ownerId = '65e4b439feba3388013694f7';

// Create 10 book examples with the specified owner ObjectId
const createBooks = async () => {
  try {
    const books = [];
    for (let i = 0; i < 10; i++) {
      const book = await Book.create({
        title: `Book ${i + 1}`,
        author: 'Author Name',
        condition: 'Good',
        saleType: 'sale',
        price: 10,
        availability: true,
        quantity: 1,
        owner: ownerId
      });
      books.push(book);
    }
    console.log('Books created:', books);
  } catch (error) {
    console.error('Error creating books:', error);
  } finally {
    // Close the connection after creating books
    mongoose.disconnect();
  }
};

// Call the function to create books
createBooks();
