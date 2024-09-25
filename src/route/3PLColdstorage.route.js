const express = require('express');

const router=express.Router();

const {verify}=require('../middleware/token/verifyToken');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware');

const PLColdStorageController=require('../controller/3PLColdStorage.controller');

// 3PL ColdStorage
// Add 3PL Coldstorage
router.post('/add/ThreePL/Coldstorage',verify(['LISTER', 'ADMIN']),upload.fields([{name:'cold_storage_details[ColdStorageImage]'}]),PLColdStorageController.Add3PLColdStorage);

// GET LISTER ALL 3PL Coldstorage
router.get('/get/3PL/ColdStorage/Lister/All',verify(['LISTER', 'ADMIN']),PLColdStorageController.AllPLColdStorage);

// GET Single 3PL ColdStorage With provided ID
router.get('/get/3PL/ColdStorage/Lister/Single',PLColdStorageController.singlePLColdStorage);

// UPDATE 3PL ColdStorage Provide ID
router.put('/update/3PL/ColdStorage',verify(['LISTER', 'ADMIN']),PLColdStorageController.UpdatePLColdStorage);

// DELETE 3PL ColdStorage Provide ID
router.delete('/delete/3PL/ColdStorage',verify(['LISTER', 'ADMIN']),PLColdStorageController.DeletePLColdStorage);

module.exports=router