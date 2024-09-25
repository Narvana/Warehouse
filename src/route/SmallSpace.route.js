const express = require('express');
const router = express.Router();
const { verify } = require('../middleware/token/verifyToken');
const upload = require('../middleware/ImageUpload/imageUploadMiddleware');
const SmallSpaceController = require('../controller/SmallSpace.contoller');

// Small Space

// Add 3PL Coldstorage
router.post('/add/listing', verify(['LISTER,ADMIN']), upload.fields([{ name: "SmallSpaceImage", maxCount: 5 }]), SmallSpaceController.AddSmallSpace);

// GET LISTER ALL 3PL Coldstorage
router.get('/get/All/Listing', verify(['LISTER','ADMIN']), SmallSpaceController.getListerAllSmallSpace);

// GET Single 3PL ColdStorage With provided ID
router.get('/get/Single/Listing', SmallSpaceController.singleSmallSpace);

// UPDATE 3PL ColdStorage Provide ID
router.put('/update/Listing', verify(['LISTER','ADMIN']), upload.fields([{ name: "SmallSpaceImage", maxCount: 5 }]), SmallSpaceController.updateSmallSpace);

// DELETE 3PL ColdStorage Provide ID
router.delete('/delete/Listing', verify(['ADMIN','LISTER']), SmallSpaceController.DeleteSmallSpace);

module.exports = router;
