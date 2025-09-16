const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const UserModel = require("../models/user.model")


exports.changePassword = async (req, res) => {
	try {
		const token = req.cookies.UserToken;
		if (!token) return res.status(401).json({ message: "Unauthorized" });
		const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const { currentPassword, newPassword } = req.body;
		if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both current and new password required" });
		const user = await UserModel.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });
		const match = await bcryptjs.compare(currentPassword, user.hashedPassword);
		if (!match) return res.status(400).json({ message: "Current password is incorrect" });
		const hashedNew = await bcryptjs.hash(newPassword, 10);
		user.hashedPassword = hashedNew;
		await user.save();
		res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const token = req.cookies.UserToken;
		if (!token) return res.status(401).json({ message: "Unauthorized" });
		const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await UserModel.findByIdAndDelete(userId);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json({ message: "User account deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.deleteUser = ()=>{
res.send("Delete user route testing")
}