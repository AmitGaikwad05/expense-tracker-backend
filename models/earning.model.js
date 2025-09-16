const {model, Schema} = require("mongoose");

const earningSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},
{ timestamps: true }
);

const EarningModel = model("Earning", earningSchema);
module.exports = EarningModel;