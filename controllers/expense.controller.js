// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const token = req.cookies.UserToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const expenseId = req.params.id;
    const expense = await ExpenseModel.findOneAndDelete({ _id: expenseId, creatorId: userId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const token = req.cookies.UserToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const expenseId = req.params.id;
    const { title, desc, amount, category } = req.body;
    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { _id: expenseId, creatorId: userId },
      { title, desc, amount, category },
      { new: true }
    );
    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ expense: updatedExpense, message: "Expense updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const ExpenseModel = require("../models/expense.model");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


exports.getExpenses = async (req, res) => {
    try {
        const token = req.cookies.UserToken;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);


        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;


        const category = req.query.category || ""; 
        const filter = { creatorId: userId };
        if (category && category !== "") filter.category = category;


        const sortQuery = req.query.sort || "date_desc";
        const sort = sortQuery === "date_asc" ? { createdAt: 1 } : { createdAt: -1 };


        const [expenses, totalCount] = await Promise.all([
            ExpenseModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            ExpenseModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        expenses,
        currentPage: page,
        totalPages,
        totalExpenses: totalCount
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.postExpenses = async (req, res) => {
  try {
    const { title, desc, amount, category } = req.body;

    const token = req.cookies.UserToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);


    if (!title || !amount || category === undefined)
      return res.status(400).json({ message: "Title, amount, and category are required" });

    const newExpense = await ExpenseModel.create({
      title,
      desc,
      amount,
      category,
      creatorId: userId,
    });

    res.status(200).json({ expense: newExpense, message: "Expense added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

