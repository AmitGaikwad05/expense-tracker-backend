const express = require("express");
const expenseRoutes = express.Router();
const expenseController = require("../controllers/expense.controller")


expenseRoutes.get("/expenses", expenseController.getExpenses )
expenseRoutes.post("/expenses", expenseController.postExpenses )
expenseRoutes.delete("/expenses/:id", expenseController.deleteExpense )
expenseRoutes.put("/expenses/:id", expenseController.updateExpense )

module.exports = expenseRoutes;
