const Revenue = require("../Models/RevenueModel");
const Billing = require("../Models/BillingModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");
const Room = require("../Models/RoomModel");


const checkoutAndUpdateRevenue = async (req, res) => {
  try {
    const { residentId, invoiceDetails } = req.body;
    console.log(req.body);

    const roomAssignment = await RoomAssignment.findOne({ residentId });
    const occupiedResident = roomAssignment.occupied;
    const id = roomAssignment.roomId;
    const room = await Room.findById({ _id:id });
    if (!room) {
      return res.status(200).json({ message: "room not found" });
    }
    room.occupied -= occupiedResident;
    room.availabilityStatus = "Available";
    room.checkOutDate = new Date();
    await room.save();
    await RoomAssignment.deleteMany({ residentId });
    const newRevenue = new Revenue({
      source: "Room Booking",
      amount: invoiceDetails.total,
      date: new Date(),
      description: "Room booking revenue",
      residentId: residentId,
      month: new Date().toLocaleString('en-US', { month: 'long' }),
    });
    await newRevenue.save();
    res.status(200).json({ message: "Revenue updated successfully" });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// getting all payments data
const getAllPayments = async (req, res) => {
  try {
    const revenue = await Billing.find();
      const payments = revenue.map(payment => ({
        invoiceNumber: payment.invoiceNumber,
        billingAmount: payment.billingAmount,
        billingDate: payment.billingDate,
        paymentStatus: payment.paymentStatus
      }))
    const numberOfPayments = revenue.length;
      const totalPayments = revenue.reduce((total, payment) => total + payment.billingAmount, 0)
    res.status(200).json({ payments,totalPayments,numberOfPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  checkoutAndUpdateRevenue,
  getAllPayments,
};
