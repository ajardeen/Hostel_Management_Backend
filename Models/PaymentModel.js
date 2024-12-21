const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Billing",
    required: true,
  },
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ["Stripe", "PayPal", "Card"],
    required: true,
  },
  status: { type: String, enum: ["Success", "Failed"], required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);
