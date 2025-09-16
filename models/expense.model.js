const {model, Schema} = require("mongoose");

const expenseSchema = new Schema({
title:{
    type: String,
     required: true 
},
desc:{
    type: String,
},
amount:{
    type: Number,
    required: true
},
category:{
    type: String,
    required: true
},
creatorId:{ 
            type: Schema.Types.ObjectId,
             ref: 'User',
},
},
{ timestamps: true }
);

const ExpenseModel = model("Expense", expenseSchema);
module.exports = ExpenseModel;