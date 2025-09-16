const express = require("express");
const authController = require("../controllers/auth.controller")
const authRoutes = express.Router();

authRoutes.post("/signup", authController.signup )
authRoutes.post("/login", authController.login )
authRoutes.get("/verify", authController.verify )
authRoutes.get("/logout", authController.logout )

module.exports = authRoutes;
