const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g., "Maintenance", "Utilities", "Salaries"
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  });
  
  const Expense = mongoose.model('Expense', ExpenseSchema);
  module.exports = Expense;
  