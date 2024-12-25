const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  source: { type: String, required: true }, // e.g., "Room Booking", "Service Fee"
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  month:{type:String,required:false,enum:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']},
  description: { type: String },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }, // Reference to Resident
});

const Revenue = mongoose.model('Revenue', RevenueSchema);
module.exports = Revenue;
