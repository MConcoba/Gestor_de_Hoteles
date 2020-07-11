'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'encrypt_password'

exports.ensureAuth = function(req, res, netx){
    if(!req.headers.authorization){
        return res.status(404).send({menssage: 'La peticion no tiene Autentificacion'})

    }
    
    var token = req.headers.authorization.replace(/['"']+/g, '')

    try {
        var playload = jwt.decode(token, secret)
        if(playload.exp <= moment().unix()){
            return res.status(401).send({menssage: 'El token ha expirado'})
        }
    } catch (ex) {
        return res.status(404).send({menssage: 'El token no es valido'})
    }

    req.user = playload
    netx()
}