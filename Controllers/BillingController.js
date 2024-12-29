const Billing = require("../Models/BillingModel");
const mailer = require("../Configs/Mailer");
const User = require("../Models/UserModel");
require("dotenv").config();
const createBilling = async (req, res) => {
  try {
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
      invoiceDetails,
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
      paymentHistory: [
        {
          amountPaid: billingAmount,
          paymentDate: new Date(),
          method: "PayPal",
        },
      ],
    });

    await newBilling.save();

    // Find the resident
    const resident = await User.findById(residentId);
    // Send mail
    mailer.sendMail({
      from: process.env.SMTP_USER,
      to: resident.email,
      subject: `Invoice from HosteLedge`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 16px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center;">
          <div style="font-weight: bold; color: #374151;">HosteLedge</div>
        </div>
        <div style="color: #374151;">
          <div style="font-weight: bold; font-size: 16px;">INVOICE</div>
          <div style="font-size: 12px;">Date: ${new Date().toLocaleDateString()}</div>
          <div style="font-size: 12px;">#${invoiceDetails.invoiceNumber}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; gap: 16px; font-size: 14px; margin-bottom: 16px;">
        <div>
          <h2 style="font-weight: bold; margin-bottom: 4px;">Hostel Details:</h2>
          <div style="color: #374151;">HosteLedge</div>
          <div style="color: #374151;">123 Hostel Street</div>
          <div style="color: #374151;">support@hosteledge.com</div>
        </div>
        <div>
          <h2 style="font-weight: bold; margin-bottom: 4px;">Bill To:</h2>
          <div style="color: #374151;">Resident ID: ${invoiceDetails.username}</div>
          <div style="color: #374151;">Room: ${invoiceDetails.roomNumber}</div>
          <div style="color: #374151;">${invoiceDetails.email}</div>
        </div>
      </div>

      <table style="width: 100%; font-size: 14px; margin-bottom: 16px; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <th style="padding: 8px 0; text-align: left;">Description</th>
            <th style="padding: 8px 0; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Room Fees</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.roomfees}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Room Occupied</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.occupied}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Washing</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.washing}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Electricity:</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.electricity}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Water</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.water}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Internet</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.internet}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Maintenance</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.maintenance}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0;">Cleaning</td>
            <td style="padding: 8px 0; text-align: right;">${invoiceDetails.cleaning}</td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 14px;">
        <div style="display: flex; justify-content: flex-end; gap: 8px; padding: 4px 0;">
          <span>Subtotal:</span>
          <span>${invoiceDetails.subTotal}</span>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px; padding: 4px 0;">
          <span>Tax 10%:</span>
          <span>-${invoiceDetails.tax}</span>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px; padding: 4px 0; font-weight: bold;">
          <span>Total:</span>
          <span>${invoiceDetails.total}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: #374151; margin-top: 16px; text-align: center;">
        <div>Payment is due within 30 days. Late payments are subject to a 5% fee.</div>
        <div>Queries: Queries: billing@hosteledge.com</div>
        <div>Thank you for staying with HosteLedge!</div>
      </div>
    </div>
    </body>
    </html>
  `,
    });    res.status(201).json({ message: "Successfully created ", newBilling });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createBilling };