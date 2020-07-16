'use strict'
var express=require('express');
var AccesorioController=require('../controllers/accesorio');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./upload/accesorio'});
var router=express.Router();
//Rutas que sirven

router.get('/ausente',AccesorioController.datosestudiante);
router.post('/guardaraccesorio',AccesorioController.save);
router.get('/listaraccesorio/:parametro?',AccesorioController.get_accesorio);
router.put('/editaraccesorio/:id',AccesorioController.update);
router.delete('/eliminaraccesorio/:id',AccesorioController.delete);
router.get('/buscaraccesorio/:id',AccesorioController.search);
router.post('/subir-imagen-accesorio/:id',md_upload,AccesorioController.upload);
router.get('/obtener-imagen-accesorio/:nombreimagen',AccesorioController.obtener_imagen);
module.exports=router;