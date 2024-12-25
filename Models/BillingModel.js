const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  invoiceNumber:{type:String,required:true},
  roomNumber: { type: String, required: true },
  roomFee: { type: Number, required: true },
  utilities: { type: Number, default: 0 },
  additionalServices: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 },
  billingAmount: { type: Number, required: true },
  billingDate: { type: Date, required:true ,default: Date.now },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending",
  },
  paymentHistory: [
    {
      amountPaid: { type: Number },
      paymentDate: { type: Date ,default: Date.now},
      method: { type: String, enum: ["Card", "PayPal", "BankTransfer"],default:"PayPal" },
    },
  ],
});

module.exports = mongoose.model("Billing", billingSchema);
