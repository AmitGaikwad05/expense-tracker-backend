const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = async ()=>{

try{
await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to DB"); 
}
catch(error){
console.log(`Error connecting DB: ${error.message}`)
}

} 

module.exports = connectToDB;