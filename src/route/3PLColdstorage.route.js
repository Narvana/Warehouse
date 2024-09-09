const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware');

const PLColdStorageController=require('../controller/3PLColdStorage.controller');

// 3PL ColdStorage
router.post('/add/ThreePL/Coldstorage',verifyToken.verify,verifyRoles(['LISTER', 'ADMIN']),upload.fields([{name:'cold_storage_details[ColdStorageImage]'}]),PLColdStorageController.Add3PLColdStorage);
router.get('/get/3PL/ColdStorage/Lister/All',verifyToken.verify,PLColdStorageController.AllPLColdStorage);
router.get('/get/3PL/ColdStorage/Lister/Single',verifyToken.verify,PLColdStorageController.singlePLColdStorage);
router.put('/update/3PL/ColdStorage',verifyToken.verify,PLColdStorageController.UpdatePLColdStorage);
router.delete('/delete/3PL/ColdStorage',verifyToken.verify,PLColdStorageController.DeletePLColdStorage);

module.exports=router