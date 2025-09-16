const express = require("express");
const userRoutes = express.Router();
const userController = require("../controllers/user.controller")

userRoutes.post("/user/change-password", userController.changePassword);
userRoutes.delete("/user/delete", userController.deleteUser);

module.exports = userRoutes;