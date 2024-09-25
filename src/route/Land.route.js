const express = require('express');

const router=express.Router();

const {verify}=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware');

const LandController=require('../controller/Land.controller');

// 3PL ColdStorage

// Add LAND
router.post('/add',verify(['LISTER', 'ADMIN']),upload.fields([{name:'LandImage'}]),LandController.AddLand);

// GET LISTER ALL LAND
router.get('/get/Lister/All',verify(['LISTER', 'ADMIN']),LandController.AllLandLister);

// GET Single LAND With provided ID
router.get('/get/Lister/Single',LandController.ListerSingleLand);

// UPDATE LAND Provide ID
router.put('/Update',verify(['LISTER', 'ADMIN']),LandController.UpdateListedLand);

// DELETE LAND Provide ID
router.delete('/Delete',verify(['LISTER','ADMIN']),LandController.RemoveLand);

module.exports=router