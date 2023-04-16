'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isUserVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = mongoose.model('Roles',RolesSchema);