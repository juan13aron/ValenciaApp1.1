'use strict'
var validator1=require('validator');
var Persona=require('../models/estudiante');
const { default: validator } = require('validator');
var fs=require('fs');
var path=require('path');
const { exists } = require('../models/estudiante');
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
        var persona=new Persona;
        
        //Se asignan los valores
        persona.nombre=params.nombre;
        persona.cedula=params.cedula;
        persona.telefono=params.telefono;
        persona.contrasena=params.contrasena;
        //Guardar
        persona.save((err,PersonaStored)=>{
            if(err || !PersonaStored){
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
                persona,
            })
        }
        else{
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos',
            })
        }

    },
    get_personas:(req,res)=>{
        //find
        Persona.find({}).exec((err,personas)=>{
            if(err){
                return res.status(200).send({
                    status:'error',
                    message:'Error al mirar los artículos',
                })
            }

            return res.status(200).send({
            status:'success',
           personas,
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
            
             Persona.findOneAndUpdate({_id:id},parametros,{new:true},(err,EstudianteActualizado)=>{
                if(err){
                    return res.status(200).send({
                        status:'error',
                        message:'no se pudo actualizar',
                    }) 
                }
                if(!EstudianteActualizado){
                    return res.status(200).send({
                        status:'error',
                        message:'Id erroneo',
                    }) 
                }
                else{
                    return res.status(200).send({
                        status:'Exito',
                        message:EstudianteActualizado,
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
        Persona.findOneAndDelete({_id:id},(err,EstudianteRemove)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!EstudianteRemove){
                return res.status(500).send({
                    status:"error",
                    message:"id equivocado"
                })
            }
            return res.status(200).send({
                status: "exito al eliminar",
                message:EstudianteRemove,
            })
        })
    },
    search:(req,res)=>{
        var buscar=req.params.id;
        Persona.find({
            "$or":[
                {"nombre":{"$regex":buscar,"$options":"i"}},
                {"cedula":{"$regex":buscar,"$options":"i"}},
            ]
        }).exec((err,estudiantes)=>{
            if(err){
                return res.status(500).send({
                    status:"error",
                    message:"Error co se que pasa"
                })
            }
            if(!estudiantes){
                return res.status(500).send({
                    status:"error",
                    message:"no se encontro "
                })
            }
            return res.status(200).send({
                status: "exito",
                message:estudiantes,
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
            Persona.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,EstudianteUpdate)=>{
                    if(err || !EstudianteUpdate){
                        return res.status(404).send({
                            status:'error',
                            message:'Error al guardar l aimagen de la articulo',
                        })
                    }
                    return res.status(200).send({
                        status:'Success',
                        EstudianteUpdate,
                    })
                })
        }
    },
    obtener_imagen:(req,res)=>{
        var file=req.params.nombreimagen;
        var file_path='./upload/estudiante/'+file;
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