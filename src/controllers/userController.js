'use strict'

var User = require('../models/user')
var jwt = require('../service/jtw')
var bycypt = require('bcrypt-nodejs')

var PDF = require('pdfkit')
var fs = require('fs')

function newUser(req, res) {
    var user = new User();
    var params = req.body

    if(params.name && params.email && params.password && params.phone && (params.role == 'ROL-USER')){
        user.name = params.name
        user.email = params.email
        user.phone = params.phone
        user.role = 'ROL-USER'

        User.find({$or: [
            {email: params.email}
        ]})
        .exec((err, usuarios)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
            if(usuarios && usuarios.length >= 1){
                return res.status(500).send({menssage: 'El usuario ya existe'})
            }else{
                bycypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;
                
                user.save((err, userCreate)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
                    if(userCreate){
                        res.status(200).send({Usuario: userCreate})
                    }else{
                        res.status(404).send({menssage: 'NO se ha podido crear el usuario'})
                    }
                })
                })
            }
        })
    
    }else if(params.name && params.email && params.address && params.phone && params.date && params.qualification && params.price && params.password){
        user.name = params.name
        user.email = params.email
        user.address = params.address
        user.phone = params.phone
        user.date = params.date
        user.qualification = params.qualification
        user.price = params.price
        user.role = 'ROLE_HOTEL'

        User.find({$or: [
            {email: params.email},
            {address: params.address}
        ]})
        .exec((err, usuarios)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de Hoteles'})
            if(usuarios && usuarios.length >= 1){
                return res.status(500).send({menssage: 'El Hotel ya existe'})
            }else{
                bycypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;
                
                user.save((err, userCreate)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de Hoteles'})
                    if(userCreate){
                        res.status(200).send({Usuario: userCreate})
                    }else{
                        res.status(404).send({menssage: 'NO se ha podido crear el hotel'})
                    }
                })
                })
            }
        })
    }else{
        return res.status(404).send({menssage: 'Rellene todos los datos'})
    }
}



function login(req, res){
    var params = req.body

    User.findOne({email: params.email}, (err, userLogin)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion'})
        if(userLogin){
            bcrypt.compare(params.password, userLogin.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(userLogin)
                        })
                    }else{
                        userLogin.password = undefined
                        return res.status(200).send({Empresa: userLogin})
                    }
                }else{
                    return res.status(404).send({menssage: 'El usuario no se logró identificar'})
                }
            })
        }else{
            return res.status(404).send({menssage: 'El Usuario no se a podido logear'})
        }
    })
}



function updateUser(req, res){
    var userLog = req.user.sub
    var params = req.body;

    User.findByIdAndUpdate(userLog, params, {new: true}, (err, updatedUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
        if(!updatedUser) return res.status(404).send({menssage: 'No se ha podido editar el usuario'})
        return res.status(202).send({Usuario: updatedUser})
    })
}



function delteUser(req, res) {
    var userLog = req.user.sub
    
    User.findByIdAndDelete(userLog, (err, deletedUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
        if(!deletedUser) return res.status(404).send({menssage: 'No se ha podido elimiar al usuario'})
        return res.status(202).send({Usuario_Eliminado : deletedUser})
    })
}



function searchDate(req, res) {
    var userLog = req.user.sub
    var params = req.body

    User.findById(userLog, (err, loginUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!loginUser) return res.status(404).send({menssage: 'Error en la busqueda'})
        console.log(loginUser.role)
        if(loginUser.role == 'ROL-USER'){
            User.find({role : 'ROLE_HOTEL', date: {$gte: params.start, $lt: params.end}}, (err, hotels)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de hoteles'})
                if(!hotels) return res.status(404).send({menssage: 'Error en la busqueda'})
                return res.status(202).send({Hoteles: hotels})
            })
        }
        
    })
    
}

function searchQualification(req, res) {
    var userLog = req.user.sub
    var params = req.body
    
    User.findById(userLog, (err, loginUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!loginUser) return res.status(404).send({menssage: 'Error en la busqueda'})
        console.log(loginUser.role)
        if(loginUser.role == 'ROL-USER'){
            User.find({role : 'ROLE_HOTEL', qualification: params.calificacion}, (err, hotels)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de hoteles'})
                if(!hotels) return res.status(404).send({menssage: 'Error en la busqueda'})
                return res.status(202).send({Hoteles: hotels})
            })
        }
        
    })
}

function orderHotels(req, res) {

    User.find({role : 'ROLE_HOTEL'}).sort({name: 1}).exec((err, hotels)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de hoteles'})
        if(!hotels) return res.status(404).send({menssage: 'Error en la busqueda'})
        return res.status(202).send({Hoteles: hotels})
    })
 
}

function orderPriceM(req, res) {
    var userLog = req.user.sub
    var params = req.body

    User.findById(userLog, (err, loginUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!loginUser) return res.status(404).send({menssage: 'Error en la busqueda'})
        console.log(loginUser.role)
        if(loginUser.role == 'ROL-USER'){
            User.find({role : 'ROLE_HOTEL'}).sort({price: -1}).exec((err, hotels)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de hoteles'})
                if(!hotels) return res.status(404).send({menssage: 'Error en la busqueda'})
                return res.status(202).send({Hoteles: hotels})
            })
        }
        
    })
}

function orderPricem(req, res) {
    var userLog = req.user.sub
    var params = req.body

    User.findById(userLog, (err, loginUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!loginUser) return res.status(404).send({menssage: 'Error en la busqueda'})
        console.log(loginUser.role)
        if(loginUser.role == 'ROL-USER'){
            User.find({role : 'ROLE_HOTEL'}).sort({price: 1}).exec((err, hotels)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de hoteles'})
                if(!hotels) return res.status(404).send({menssage: 'Error en la busqueda'})
                return res.status(202).send({Hoteles: hotels})
            })
        }
        
    })
}


function crearPdf(req, res){
    var userLog = req.user.sub
    var params = req.body;
    var doc = new PDF();
    var hotelId = req.params.id




    User.findById(userLog, (err, loginUser)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!loginUser) return res.status(404).send({menssage: 'Error en la busqueda'})
        if(loginUser.role == 'ROL-USER'){
            User.findById({_id: hotelId}, {"name" : 1, "address" : 1, "price": 1, "phone": 1, "qualification" : 1}, (err, hotel)=>{
                if(err) return res.status(500).send({menssage: 'Error al agregar empreado'})
                if(!hotel) return res.status(404).send({menssage: 'Error al ralizar el cambio'})
                else{

                    console.log(hotel.address)

                    doc.pipe(fs.createWriteStream('./src/doc/' + params.nombreDoc + '.pdf'));

               doc
                    .fillColor('red')
                    .font('Times-Roman')
                    .fontSize(25)
                    .text('INFORMACION DEL HOTEL ' + hotel.name)
                
                doc
                    .fillColor('black')
                    .font('Times-Roman')
                    .fontSize(15)
                    .text('   ')
                    .text('Direccion: ' + hotel.address)
                    .text('Telefono: ' + hotel.phone)
                    .text('Precio: Q.' + hotel.price)
                    .text('Calificacion: ' + hotel.qualification)


                    
                
                doc.end();
    
                return res.status(200).send({menssage: hotel})  
                
                   } 
            })

    }
                
    })
}



module.exports = {
    newUser,
    login,
    updateUser,
    delteUser,

    searchDate,
    searchQualification,

    orderHotels,

    orderPriceM,
    orderPricem,

    crearPdf


}