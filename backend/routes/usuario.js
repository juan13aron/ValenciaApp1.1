'use strict'
var express=require('express');
var UsuarioController=require('../controllers/usuario');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./upload/usuario'});
var router=express.Router();
//Rutas que sirven

router.get('/ausente',UsuarioController.datosestudiante);
router.post('/guardarusuario',UsuarioController.save);
router.get('/listarusuario/:parametro?',UsuarioController.get_usuarios);
router.put('/editarusuario/:id',UsuarioController.update);
router.delete('/eliminarusuario/:id',UsuarioController.delete);
router.get('/buscarusuario/:id',UsuarioController.search);
router.post('/subir-imagen-usuario/:id',md_upload,UsuarioController.upload);
router.get('/obtener-imagen-usuario/:nombreimagen',UsuarioController.obtener_imagen);
module.exports=router;