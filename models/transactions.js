'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accountNo: {
        type: Number,
        require:true
    },
    transactionId:{
        type:String,
        require:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = mongoose.model('Transactions', TransactionSchema);