const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    session_id:{
        type: String,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
      },
      saleType: {
        type: String,
        enum: ['rent', 'buy'],
        required: true
      },
      transactionDate: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
      },
      deliveryMethod: {
        type: String,
        enum: ['self-pickup', 'delivery-services', 'mailing']
      },
      days:{
        type: Number,
        default: 0
      }
});

transactionSchema.statics.fetchRecentTransactions = async function(userId, limit = 10) {
    try {
        return await this.find({ $or: [{ buyer: userId }, { seller: userId }] })
            .sort({ transactionDate: -1 })
            .limit(limit)
            .populate('book')
            .populate('buyer', 'username email') 
            .populate('seller', 'username email');
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('Transaction', transactionSchema);
