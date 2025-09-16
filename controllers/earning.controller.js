const EarningModel = require("../models/earning.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.deleteEarning = async (req, res) => {
        try {
                const token = req.cookies.UserToken;
                if (!token) return res.status(401).json({ message: "Unauthorized" });
                const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const earningId = req.params.id;
                const earning = await EarningModel.findOneAndDelete({ _id: earningId, creatorId: userId });
                if (!earning) return res.status(404).json({ message: "Earning not found" });
                res.status(200).json({ message: "Earning deleted successfully" });
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
};


exports.updateEarning = async (req, res) => {
        try {
                const token = req.cookies.UserToken;
                if (!token) return res.status(401).json({ message: "Unauthorized" });
                const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const earningId = req.params.id;
                const { title, desc, amount, category } = req.body;
                const updatedEarning = await EarningModel.findOneAndUpdate(
                        { _id: earningId, creatorId: userId },
                        { title, desc, amount, category },
                        { new: true }
                );
                if (!updatedEarning) return res.status(404).json({ message: "Earning not found" });
                res.status(200).json({ earning: updatedEarning, message: "Earning updated successfully" });
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
};


exports.getEarnings = async (req, res) => {
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

         
                const [earnings, totalCount] = await Promise.all([
                        EarningModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                        EarningModel.countDocuments(filter),
                ]);

                const totalPages = Math.ceil(totalCount / limit);

                res.status(200).json({
                        earnings,
                        currentPage: page,
                        totalPages,
                        totalEarnings: totalCount
                });
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
};


exports.postEarnings = async (req, res) => {
        try {
                const { title, desc, amount, category } = req.body;
                const token = req.cookies.UserToken;
                if (!token) return res.status(401).json({ message: "Unauthorized" });
                const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);


                if (!title || !amount || category === undefined)
                        return res.status(400).json({ message: "Title, amount, and category are required" });

                const newEarning = await EarningModel.create({
                        title,
                        desc,
                        amount,
                        category,
                        creatorId: userId,
                });

                res.status(200).json({ earning: newEarning, message: "Earning added successfully" });
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
};
