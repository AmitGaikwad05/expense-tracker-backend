const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const UserModel = require("../models/user.model")

// =================== SIGNUP LOGIC ======================
exports.signup = async (req, res)=>{
    const {name, email, password} = req.body;   
    const hashedPassword = await bcryptjs.hash(password, 15);
    
    await UserModel.create({name, email, hashedPassword});
    console.log("User registered successfully");

    res.status(200).json({ message: "User created successfully" });
}

// =================== LOGIN LOGIC ======================
exports.login = async (req, res)=>{
    const {email, password} = req.body;   
    const user = await UserModel.findOne({email:email});


    if(!user){
        return res.status(401).json({success: false, message: "no-account"})
    }
    
    const isPasswordMatched = await bcryptjs.compare(password, user.hashedPassword);
    
    if(!isPasswordMatched){
        return res.status(401).json({success: false, message: "wrong-password"})
    }
    
    const payload = {
        userId: user._id,
    }

const token = jwt.sign(
  payload, 
  process.env.JWT_SECRET_KEY
);

res.cookie('UserToken', token, { httpOnly: true, secure: true, sameSite: "none", path: "/"  });

res.status(200).json({user: user, success: true, message: "Logged in successfully"});

}

// =================== TOKEN VERIFICATION LOGIC ======================
exports.verify = async (req, res)=>{

const token = req.cookies.UserToken;
console.log(req.cookies);

if(!token){
    return res.status(401).json({message: "Authentication failed - Amit"});
}

const {userId}  = jwt.verify(token, process.env.JWT_SECRET_KEY);

console.log(userId)

const user = await UserModel.findById(userId);

res.status(200).json({user, success:true, message: "Authenticated user"});

}

exports.logout = (req, res)=>{
  res.clearCookie('UserToken', { httpOnly: true, secure: true, sameSite: "none", path: "/"  });
  res.status(200).json({message: "User Logged out successfully"});
}

