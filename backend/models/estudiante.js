'use strict'
var mongoose=require('mongoose'); //para conectar con mongoDB
var Schema=mongoose.Schema;
var PersonaSchema=Schema({
    nombre:String,
    cedula:String,
    telefono:String,
    contrasena:String,
    image:String,
    
});
module.exports=mongoose.model("Persona",PersonaSchema);