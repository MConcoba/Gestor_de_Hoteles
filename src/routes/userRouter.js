'use strict'


var express = require("express")
var UserController = require("../controllers/userController")
var md_auth = require('../minddlewares/autentification')

var api = express.Router();

api.post('/new-user', UserController.newUser)
api.post('/login', UserController.login)
api.put('/update-user', md_auth.ensureAuth, UserController.updateUser)
api.delete('/delete-user', md_auth.ensureAuth, UserController.delteUser)


api.get('/dates-hotel', md_auth.ensureAuth, UserController.searchDate)
api.get('/qualification-hotel', md_auth.ensureAuth, UserController.searchQualification)
api.get('/order-price-mayor', md_auth.ensureAuth, UserController.orderPriceM)
api.get('/order-price-menor', md_auth.ensureAuth, UserController.orderPricem)
api.get('/order-hotel', md_auth.ensureAuth, UserController.orderHotels)

api.get('/report/:id', md_auth.ensureAuth, UserController.crearPdf)


module.exports = api