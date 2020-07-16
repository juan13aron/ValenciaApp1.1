'use strict'
var express=require('express');
var PersonaController=require('../controllers/estudiante');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./upload/estudiante'});
var router=express.Router();
//Rutas que sirven

router.get('/ausente',PersonaController.datosestudiante);
router.post('/guardar',PersonaController.save);
router.get('/listar/:parametro?',PersonaController.get_personas);
router.put('/editar/:id',PersonaController.update);
router.delete('/eliminar/:id',PersonaController.delete);
router.get('/buscar/:id',PersonaController.search);
router.post('/subir-imagen/:id',md_upload,PersonaController.upload);
router.get('/obtener-imagen/:nombreimagen',PersonaController.obtener_imagen);
module.exports=router;