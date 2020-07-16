'use strict'
var mongoose=require('mongoose'); //para conectar con mongoDB
var Schema=mongoose.Schema;
var UsuarioSchema=Schema({
    nombre:String,
    cedula:String,
    telefono:String,
    contrasena:String,
    image:String,
    
});
module.exports=mongoose.model("Usuario",UsuarioSchema);