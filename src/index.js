'use sttict'

const mongoose = require("mongoose")
const app = require("./app")

mongoose.Promise = global.Promise


mongoose.connect('mongodb://localhost:27017/DBManagerHotels-2018551', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Conexion DataBase successful")

    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), ()=>{
        console.log(`Run server in port: ${app.get('port')}`)
    })
    
}).catch(err => console.log(err))