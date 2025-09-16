const express = require("express");
const earningRoute = express.Router();
const earningController = require("../controllers/earning.controller")

earningRoute.get("/earnings", earningController.getEarnings)
earningRoute.post("/earnings", earningController.postEarnings)
earningRoute.delete("/earnings/:id", earningController.deleteEarning)
earningRoute.put("/earnings/:id", earningController.updateEarning)

module.exports = earningRoute;