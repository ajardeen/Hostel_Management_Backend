const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  source: { type: String, required: true }, // e.g., "Room Booking", "Service Fee"
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }, // Reference to Resident
});

const Revenue = mongoose.model('Revenue', RevenueSchema);
module.exports = Revenue;
