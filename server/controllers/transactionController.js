const Transaction = require("../models/Transaction.js");
const Book = require("../models/Book.js");
const User = require("../models/User.js");
const jwt = require('jsonwebtoken'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { book, totalPrice, purchaseOption,deliveryMethod,rentDays } = req.body;

  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decodedToken = jwt.verify(token.split(' ')[1], "easy");
    const buyerId = decodedToken.userId;
    const bookId = book._id;
    const buyer = await User.findById(buyerId);
    const books = await Book.findById(bookId);
    if(books.availability === false) {
      return res.status(400).json({ message: 'Book is not available' });
    }
    const ownerId = books.owner;
    const seller = await User.findById(ownerId);
    console.log(buyer._id, seller._id)
    if(buyer._id.equals(seller._id)) {
      return res.status(400).json({ message: 'You cannot buy your own book' });
    }

    if(rentDays > 0 && purchaseOption === 'rent') {
      noDays = rentDays;
    } else {
      noDays = 0;
    }
    let total = totalPrice;
    if(deliveryMethod === 'mailing') {
      total -= 20;
    } else if(deliveryMethod === 'delivery-services') {
      total -= 40;
    } else {
      total -= 0;
    }

    total = total - 20;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'inr', 
            unit_amount: totalPrice * 100, 
            product_data: {
              name: book.title,
              images: [book.image],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/completepayment",
      cancel_url: "http://localhost:5173/completepayment",
    });

    const transaction = new Transaction({
      session_id: session.id,
      buyer: buyerId,
      seller: seller, 
      book: bookId,
      saleType: purchaseOption, 
      amount: total,
      deliveryMethod: deliveryMethod,
      days: noDays
    });
    await transaction.save();

    res.status(200).json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

exports.completePayment = async (req, res) => {
  try {
    const { checkout_session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(checkout_session_id);

    if (session.payment_status === 'paid') {
      const transactions = await Transaction.findOne({ session_id: checkout_session_id });
      bookId = transactions.book;
      const book = await Book.findById(bookId);
      const ownerId = book.owner;
      const users = await User.findById(ownerId);
      users.wallet += transactions.amount;
      await users.save();
      book.availability = false;
      const updatedBook = await book.save();
      transactions.status = 'completed';
      await transactions.save();
      
      if (!transactions) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      return res.status(200).json({ message: 'Payment completed successfully', transactions });
    } else {
      const transaction = await Transaction.findOneAndUpdate(
        { session_id: checkout_session_id },
        { status: 'cancelled' },
      );

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      return res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

module.exports.fetchRecentTransactions = async(req,res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const decodedToken = jwt.verify(token.split(' ')[1], "easy");
  const userId = decodedToken.userId;
  try {
    const transactions = await Transaction.find({$or: [{ buyer: userId }, { seller: userId }]}).sort({ createdAt: -1 }).limit(5);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};