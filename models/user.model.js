const {model, Schema} = require("mongoose");

const userSchema = new Schema({
name:{
     type: String, 
     default: "Guest"
},
email:{
    type: String, 
    required: true, 
    unique: true
},
hashedPassword:{
    type: String,
     required: true
}
},
{ timestamps: true }
);


const UserModel = model("User", userSchema);
module.exports = UserModel;