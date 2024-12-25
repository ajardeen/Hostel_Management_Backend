const Billing = require("../Models/BillingModel");

//create billing data
const createBilling = async (req, res) => {
  const {
    residentId,
    invoiceNumber,
    roomNumber,
    roomFee,
    utilities = 0,
    additionalServices = 0,
    discount = 0,
    lateFee = 0,
    billingAmount,
    paymentStatus,
  } = req.body;

  
  const newBilling = new Billing({
    residentId,
    invoiceNumber,
    roomNumber,
    roomFee,
    utilities,
    additionalServices,
    discount,
    lateFee,
    billingAmount,
    paymentStatus,
    paymentHistory:[{
      amountPaid:billingAmount,
      paymentDate: new Date(),
      method:"PayPal"
    }
     
    ],
  });
  await newBilling.save();
  res.status(201).json({ message: "Successfully created ", newBilling });
};

module.exports = { createBilling };
