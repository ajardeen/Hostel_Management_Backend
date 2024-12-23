const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }, // Reference to Resident
    paymentMethod: { type: String, required: true }, // e.g., "Stripe", "PayPal", "Credit Card"
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    referenceNumber: { type: String, required: true }, // Unique identifier for the payment
    description: { type: String },
  });
  
  const Transaction = mongoose.model('Transaction', TransactionSchema);
  module.exports = Transaction;
  