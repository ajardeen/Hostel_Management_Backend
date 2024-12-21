const Payment = require('../models/Payment');

// app.post('/api/payments/process', async (req, res) => {
//     const { invoiceId, residentId, amount, paymentMethod } = req.body;
  
//     // Validate invoice
//     const invoice = await Billing.findById(invoiceId);
//     if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  
//     // Update payment history
//     invoice.paymentHistory.push({ amountPaid: amount, paymentDate: Date.now(), method: paymentMethod });
  
//     if (amount >= invoice.totalAmount) invoice.paymentStatus = 'Paid';
  
//     await invoice.save();
  
//     const payment = new Payment({
//       invoiceId,
//       residentId,
//       amount,
//       paymentMethod,
//       status: 'Success',
//     });
  
//     await payment.save();
//     res.status(201).json({ payment, invoice });
//   });