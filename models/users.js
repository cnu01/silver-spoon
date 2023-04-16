'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    password: { 
        type: String,
        //  required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    isUserVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    oneTimePassword:{
        type: String,
        required: true
    },
    oneTimePasswordExpires:{
        type: Date,
        require:true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
