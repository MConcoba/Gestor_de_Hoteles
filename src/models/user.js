'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    address: String,
    phone: String,
    date: Date,
    qualification: String,
    price: Number

})



module.exports = mongoose.model('user', UserSchema)