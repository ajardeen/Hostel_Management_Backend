const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "Maintenance", "Utilities", "Salaries"
  amount: { type: Number, required: true },
  month: {
    type: String,
    required: false,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  date: { type: Date, required: true },
  description: { type: String },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
