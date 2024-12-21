const Billing = require("../Models/BillingModel");

//create billing data
const createBilling = async (req, res) => {
  const {
    residentId,
    roomNumber,
    roomFee,
    utilities = 0,
    additionalServices = 0,
    discount = 0,
    lateFee = 0,
    billingDate,
    billingAmount,
    paymentStatus,
    paymentHistory,
  } = req.body;
  const billing = await Billing.findOne({ residentId });
  //validating billing already available are not
  if (billing) {
    res
      .status(401)
      .json({ message: "already billing created with this resident" });
    return;
  }
  const newBilling = new Billing({
    residentId,
    roomNumber,
    roomFee,
    utilities,
    additionalServices,
    discount,
    lateFee,
    billingDate,
    billingAmount,
    paymentStatus,
    paymentHistory,
  });
  await newBilling.save();
  res.status(201).json({ message: "Successfully created ", newBilling });
};

module.exports = { createBilling };
