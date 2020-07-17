'use strict'
var validator1=require('validator');
var Usuario=require('../models/usuario');
const { default: validator } = require('validator');
var fs=require('fs');
var path=require('path');
const { exists } = require('../models/usuario');
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
            var validar_cedula=!validator1.isEmpty(params.cedula);
            var validar_telefono=!validator1.isEmpty(params.telefono);
            var validar_contrasena=!validator1.isEmpty(params.contrasena);
           
        }
        catch(err){
            return res.status(404).send({
                
                message:"Faltan datos por enviar",
            })
        }
        
        //Crear el objeto a guadar
        var usuario=new Usuario;
        
        //Se asignan los valores
        usuario.nombre=params.nombre;
        usuario.cedula=params.cedula;
        usuario.telefono=params.telefono;
        usuario.contrasena=params.contrasena;
        //Guardar
        usuario.save((err,UsuarioStored)=>{
            if(err || !UsuarioStored){
                return res.status(404).send({
                    status:'error',
                    message:'La persona no se ha guardado',
                })
            }
            
        });
        //Devolver una respuesta
        if(validar_nombre && validar_cedula && validar_telefono && validar_contrasena){
            return res.status(200).send({
                status:'success',
                usuario,
            })
        }
        else{
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos',
            })
        }

    },
    get_usuarios:(req,res)=>{
        //find
        Usuario.find({}).exec((err,usuarios)=>{
            if(err){
                return res.status(200).send({
                    status:'error',
                    message:'Error al mirar los artículos',
                })
            }

            return res.status(200).send({
            status:'success',
           usuarios,
            })
        })
        
    },
    get_usuariobyid:(req,res)=>{
        var id=req.params.id;
        if(!id || id==null){
            return res.status(404).send({
                status:'Error',
                message:"No hay id",
            })
        }
        //Buscar el id
        Usuario.findById(id,(err,Usuario)=>{
            if(err){
                return res.status(404).send({
                    status:'Error',
                    message:"No se pudo procesar",
                })
            }
            if(!Usuario){
                return res.status(404).send({
                    status:'error',
                    message:"No existe el producto, ingrese una id valida",
                })
            }
            return res.status(200).send({
                status:'Exito',
                message:Usuario,
            })
        })
    },
    update:(req,res)=>{
        var id=req.params.id;
        var parametros=req.body;
        try{
            var validar_nombre=parametros.nombre;
            var validar_cedula=parametros.cedula;
            var validar_telefono=parametros.telefono;
            var validar_contrasena=parametros.contrasena;
            
        }catch(error){
            return res.status(404).send({
                status:"error",
            message:"Llene todos lo datos"
            })     
        }
        if(validar_nombre && validar_cedula && validar_telefono && validar_contrasena){
            
             Usuario.findOneAndUpdate({_id:id},parametros,{new:true},(err,UsuarioActualizado)=>{
                if(err){
                    return res.status(200).send({
                        status:'error',
                        message:'no se pudo actualizar',
                    }) 
                }
                if(!UsuarioActualizado){
                    return res.status(200).send({
                        status:'error',
                        message:'Id erroneo',
                    }) 
                }
                else{
                    return res.status(200).send({
                        status:'Exito',
                        message:UsuarioActualizado,
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
        Usuario.findOneAndDelete({_id:id},(err,UsuarioRemove)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!UsuarioRemove){
                return res.status(500).send({
                    status:"error",
                    message:"id equivocado"
                })
            }
            return res.status(200).send({
                status: "exito al eliminar",
                message:UsuarioRemove,
            })
        })
    },
    search:(req,res)=>{
        var buscar=req.params.id;
        Usuario.find({
            "$or":[
                {"nombre":{"$regex":buscar,"$options":"i"}},
                {"cedula":{"$regex":buscar,"$options":"i"}},
            ]
        }).exec((err,usuarios)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!usuarios){
                return res.status(500).send({
                    status:"error",
                    message:"no se encontro "
                })
            }
            return res.status(200).send({
                status: "exito",
                message:usuarios,
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
            Usuario.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,UsuarioUpdate)=>{
                    if(err || !UsuarioUpdate){
                        return res.status(404).send({
                            status:'error',
                            message:'Error al guardar l aimagen de la articulo',
                        })
                    }
                    return res.status(200).send({
                        status:'Success',
                        UsuarioUpdate,
                    })
                })
        }
    },
    obtener_imagen:(req,res)=>{
        var file=req.params.nombreimagen;
        var file_path='./upload/usuario/'+file;
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