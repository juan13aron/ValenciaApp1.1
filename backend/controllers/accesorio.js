'use strict'
var validator1=require('validator');
var Accesorio=require('../models/accesorio');
const { default: validator } = require('validator');
var fs=require('fs');
var path=require('path');
const { exists } = require('../models/accesorio');
const usuario = require('../models/usuario');
var controller={
    datosestudiante:(req,res)=>{
        console.log('Cualquiercosa');
        return res.status(200).send({
            nombre:'Andres',
            cedula:'14459',
            telefono:'320154',
            contrasena:'Serdna3265'
        })
    },
    save:(req,res)=>{
        //Recoger parametros
        var params=req.body;
        console.log(params);
        //Validar datos
        
        try{
            var validar_nombre=!validator1.isEmpty(params.nombre);//creamos la variable y dara true cuanto no este vacío
            var validar_precio=!validator1.isEmpty(params.precio);
            var validar_descripcion=!validator1.isEmpty(params.descripcion);
            var validar_cantidad=!validator1.isEmpty(params.cantidad);
           
        }
        catch(err){
            return res.status(404).send({
                
                message:"Faltan datos por enviar",
            })
        }
        
        //Crear el objeto a guadar
        var accesorio=new Accesorio;
        
        //Se asignan los valores
        accesorio.nombre=params.nombre;
        accesorio.precio=params.precio;
        accesorio.descripcion=params.descripcion;
        accesorio.cantidad=params.cantidad;
        //Guardar
        accesorio.save((err,AccesorioStored)=>{
            if(err || !AccesorioStored){
                return res.status(404).send({
                    status:'error',
                    message:'La persona no se ha guardado',
                })
            }
            
        });
        //Devolver una respuesta
        if(validar_nombre && validar_precio && validar_descripcion && validar_cantidad){
            return res.status(200).send({
                status:'success',
                accesorio,
            })
        }
        else{
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos',
            })
        }

    },
    get_accesorio:(req,res)=>{
        //find
        Accesorio.find({}).exec((err,accesorios)=>{
            if(err){
                return res.status(200).send({
                    status:'error',
                    message:'Error al mirar los artículos',
                })
            }

            return res.status(200).send({
            status:'success',
            accesorios,
            })
        })
        
    },
    get_accesoriobyid:(req,res)=>{
        var id=req.params.id;
        if(!id || id==null){
            return res.status(404).send({
                status:'Error',
                message:"No hay id",
            })
        }
        //Buscar el id
        Accesorio.findById(id,(err,Accesorio)=>{
            if(err){
                return res.status(404).send({
                    status:'Error',
                    message:"No se pudo procesar",
                })
            }
            if(!Accesorio){
                return res.status(404).send({
                    status:'error',
                    message:"No existe el producto, ingrese una id valida",
                })
            }
            return res.status(200).send({
                status:'Exito',
                message:Accesorio,
            })
        })
    },
    update:(req,res)=>{
        var id=req.params.id;
        var parametros=req.body;
        try{
            var validar_nombre=parametros.nombre;
            var validar_precio=parametros.precio;
            var validar_descripcion=parametros.descripcion;
            var validar_cantidad=parametros.cantidad;
            
        }catch(error){
            return res.status(404).send({
                status:"error",
            message:"Llene todos lo datos"
            })     
        }
        if(validar_nombre && validar_precio && validar_descripcion && validar_cantidad){
            
             Accesorio.findOneAndUpdate({_id:id},parametros,{new:true},(err,AccesorioActualizado)=>{
                if(err){
                    return res.status(200).send({
                        status:'error',
                        message:'no se pudo actualizar',
                    }) 
                }
                if(!AccesorioActualizado){
                    return res.status(200).send({
                        status:'error',
                        message:'Id erroneo',
                    }) 
                }
                else{
                    return res.status(200).send({
                        status:'Exito',
                        message:AccesorioActualizado,
                    }) 
                }
            })
        
        }
        else{
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos',
            })
        }

    },
    delete:(req,res)=>{
        var id=req.params.id;
        Accesorio.findOneAndDelete({_id:id},(err,AccesorioRemove)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!AccesorioRemove){
                return res.status(500).send({
                    status:"error",
                    message:"id equivocado"
                })
            }
            return res.status(200).send({
                status: "exito al eliminar",
                message:AccesorioRemove,
            })
        })
    },
    search:(req,res)=>{
        var buscar=req.params.id;
        Accesorio.find({
            "$or":[
                {"nombre":{"$regex":buscar,"$options":"i"}},
                {"precio":{"$regex":buscar,"$options":"i"}},
            ]
        }).exec((err,accesorios)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!accesorios){
                return res.status(500).send({
                    status:"error",
                    message:"no se encontro "
                })
            }
            return res.status(200).send({
                status: "exito",
                message:accesorios,
                parametro:buscar
            }) 
        })
    },
    upload:(req,res)=>{
        var file_name='Imagen no subida';
        if(!req.files){
            return res.status(404).send({
                status:'Error',
                message:file_name,
            })
        }
        var file_path=req.files.file0.path;
        var file_split=file_path.split('\\');
        var file_name=file_split[2];
        var file_extension=file_name.split('.')[1];
        if(file_extension != 'png' && file_extension != 'jpg'&&
        file_extension != 'gif'&& file_extension!='jpeg'){
            fs.unlink(file_path,(err)=>{
                return res.status(404).send({
                    status:'error',
                    message:'la extension no es valida'
                })
            });
        }
        else{
            var id=req.params.id;
            console.log(file_name);
            Accesorio.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,AccesorioUpdate)=>{
                    if(err || !AccesorioUpdate){
                        return res.status(404).send({
                            status:'error',
                            message:'Error al guardar l aimagen de la articulo',
                        })
                    }
                    return res.status(200).send({
                        status:'Success',
                        AccesorioUpdate,
                    })
                })
        }
    },
    obtener_imagen:(req,res)=>{
        var file=req.params.nombreimagen;
        var file_path='./upload/accesorio/'+file;
        fs.exists(file_path,(exists)=>{
            if(exists){
                return res.sendFile(path.resolve(file_path));

            }
            else{
                return res.status(404).send({
                    status:'error',
                    message:'La imagen no existe'
                })
            }
        })
    }
    
};
module.exports=controller;