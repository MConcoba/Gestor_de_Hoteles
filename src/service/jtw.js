'use stric'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'encrypt_password'

exports.createToken = function(user){
    var playload = {
        sub: user._id,
        name: user.name,
        email : user.email,
        username: user.username,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(playload, secret)
}