const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const SmallSpaceController=require('../controller/SmallSpace.contoller');

// Warehouse
router.post('/add/listing',verifyToken.verify,verifyRoles(['LISTER', 'ADMIN']),upload.fields([{name:"SmallSpaceImage", maxCount:5}]),SmallSpaceController.AddSmallSpace);

router.get('/get/All/Listing',verifyToken.verify,SmallSpaceController.getListerAllSmallSpace);

router.get('/get/Single/Listing',SmallSpaceController.singleSmallSpace);

router.put('/update/Listing',verifyToken.verify,upload.fields([{name:"SmallSpaceImage", maxCount:5}]),SmallSpaceController.updateSmallSpace);

router.delete('/delete/Listing',verifyToken.verify,SmallSpaceController.DeleteSmallSpace);

module.exports=router