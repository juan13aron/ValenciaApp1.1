'use strict'
var mongoose=require('mongoose'); //para conectar con mongoDB
var Schema=mongoose.Schema;
var AccesorioSchema=Schema({
    nombre:String,
    precio:String,
    descripcion:String,
    cantidad:String,
    image:String,   
});
module.exports=mongoose.model("Accesorio",AccesorioSchema);