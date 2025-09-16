const ExpenseModel = require("../models/expense.model");
const EarningModel = require("../models/earning.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


exports.dashboard = (req, res) => {
  res.send("dashboard here");
};

exports.fetchDashboardStats = async (req, res) => {
  try {
    let { from, to } = req.body;

    let fromDate, toDate;

    if (!from && !to) {
      // ================== DEFAULT: THIS MONTH ==================
      console.log("Fetching data for this month...");

      const today = new Date();
      toDate = today;

      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      // ================== CUSTOM DATES ==================
      fromDate = new Date(from);
      toDate = new Date(to);

      if (isNaN(fromDate) || isNaN(toDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (fromDate > toDate) {
        return res
          .status(400)
          .json({ message: "From date cannot be after To date" });
      }
    }

  const token = req.cookies.UserToken;
                if (!token) return res.status(401).json({ message: "Unauthorized" });
                const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ================== EXPENSES ==================
    const expenses = await ExpenseModel.find({ createdAt: { $gte: fromDate, $lte: toDate }, creatorId: userId }).sort({ createdAt: 1 });
    const totalExpenseAmt = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const noOfExpenses = expenses.length;

    // ================== EARNINGS ==================
    const earnings = await EarningModel.find({
      createdAt: { $gte: fromDate, $lte: toDate }, creatorId: userId }).sort({ createdAt: 1 });
    const totalEarningAmt = earnings.reduce((sum, earn) => sum + earn.amount, 0);
    const noOfEarnings = earnings.length;

    // ================== MONTHLY DATASET ARRAY ==================
    const monthMap = {};
    const allRecords = [...expenses.map(e => ({
      type: 'expense',
      amount: e.amount,
      date: e.createdAt
    })), ...earnings.map(e => ({
      type: 'earning',
      amount: e.amount,
      date: e.createdAt
    }))];

    allRecords.forEach(rec => {
      const d = new Date(rec.date);
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (!monthMap[monthName]) {
        monthMap[monthName] = { label: monthName, expenseAmt: 0, earningAmt: 0 };
      }
      if (rec.type === 'expense') monthMap[monthName].expenseAmt += rec.amount;
      if (rec.type === 'earning') monthMap[monthName].earningAmt += rec.amount;
    });

    const dataset = Object.values(monthMap);

    // =============== CALCULATE MONTHS & DAYS DIFFERENCE ===============
    let months =
      (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
      (toDate.getMonth() - fromDate.getMonth());

    let days = toDate.getDate() - fromDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        0
      );
      days += prevMonth.getDate();
    }

    return res.status(200).json({
      success: true,
      message:
        !from && !to
          ? "Filtered expenses and earnings for this month"
          : "Filtered expenses and earnings between given dates",
      duration: { months, days },
      totalExpenseAmt,
      totalEarningAmt,
      noOfExpenses,
      noOfEarnings,
      expenses,
      earnings,
      dataset 
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
