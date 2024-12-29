const Revenue = require("../Models/RevenueModel");
const Expense = require("../Models/ExpensesModel");
const Room = require("../Models/RoomModel");
const user = require("../Models/UserModel");
const RoomAssignment = require("../Models/RoomAssignmentsModel");

const getDashboardData = async (req, res) => {
  try {
    const staff = await user.find({ role: "staff" });
    const totalStaff = staff.length;
    const staffNames = staff.map((staff) => staff.username);
    const staffData = {
      totalStaff,
      staffNames,
    };
    const expenses = await Expense.aggregate([
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    ]);
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );
    const revenue = await Revenue.aggregate([
      { $group: { _id: "$source", totalAmount: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenue.reduce(
      (total, revenue) => total + revenue.totalAmount,
      0
    );
    const reveData = await Revenue.aggregate([
      {
        $group: {
          _id: "$month",
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const expenseData = await Expense.aggregate([
      {
        $group: {
          _id: "$month",
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    console.log("revenueData:", reveData);
    console.log("expenseData:", expenseData);
    
    const revenueData = {
      totalRevenue,
      revenue,
      reveData,
    };

    const rooms = await Room.find();
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(
      (room) => room.availabilityStatus === "Occupied"
    ).length;
    const availableRooms = rooms.filter(
      (room) => room.availabilityStatus === "Available"
    ).length;
    const occupancyRate = (occupiedRooms / totalRooms) * 100;
    const netWorth = totalRevenue - totalExpenses;
    // Fetch active room assignments with resident details checked in
    const activeAssignments = await RoomAssignment.countDocuments({
      status: "Checked In",
    });
    const inActiveAssignments = await RoomAssignment.countDocuments({
      status: "Checked Out",
    });
    const roomData = {
      netWorth,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
      activeAssignments,
      inActiveAssignments,
    };
    const expensesData = {
      totalExpenses,
      expenses,
      expenseData,
    };

    const residents = await user.find({ role: "resident" });

    const residentData = {
      residents,
    };

   

    res.status(200).json({
      message: "Successfully",
      revenueData,
      roomData,
      expensesData,
      residentData,
      staffData
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createExpense = async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;
    const expense = new Expense({
      category,
      amount,
      date,
      description,
    });
    await expense.save();
    res.status(201).json({ message: "Expense created successfully" });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRevenue = async (req, res) => {
  try {
    const { source, amount, date, description, residentId } = req.body;
    const revenue = new Revenue({
      source,
      amount,
      date,
      description,
      residentId,
    });
    await revenue.save();
    res.status(201).json({ message: "Revenue created successfully" });
  } catch (error) {
    console.error("Error creating revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getDashboardData,
  createExpense,
  deleteExpense,
  createRevenue,
};
