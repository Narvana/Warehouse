const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware');

const LandController=require('../controller/Land.controller');

// 3PL ColdStorage
router.post('/add',verifyToken.verify,verifyRoles(['LISTER', 'ADMIN']),upload.fields([{name:'LandImage'}]),LandController.AddLand);
router.get('/get/Lister/All',verifyToken.verify,LandController.AllLandLister);
router.get('/get/Lister/Single',LandController.ListerSingleLand);
router.put('/Update',verifyToken.verify,LandController.UpdateListedLand);
router.delete('/Delete',verifyToken.verify,LandController.RemoveLand);

module.exports=router