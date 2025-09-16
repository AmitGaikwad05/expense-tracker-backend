const dashboardController = require("../controllers/dashboard.controller")
const express = require("express");
const dashboardRoutes = express.Router();

dashboardRoutes.get("/", dashboardController.dashboard)
dashboardRoutes.post("/stats", dashboardController.fetchDashboardStats)    


module.exports = dashboardRoutes;
