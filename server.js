const express = require("express");
const connectToDB = require("./services/connectDB")
const dashboardRoutes = require("./routes/dashboard.routes");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const expenseRoutes = require("./routes/expense.routes");
const earningRoutes = require("./routes/earnings.routes");
const userRoutes = require("./routes/user.routes");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/dashboard", dashboardRoutes)
app.use("/auth" , authRoutes)
app.use(earningRoutes);
app.use(expenseRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

connectToDB().then(()=>{
    app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
})}).catch((error)=>{console.log(`Error connecting to DB: ${error.message}`)});



