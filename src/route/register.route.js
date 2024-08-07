const express=require('express');

const router=express.Router();

const registerController=require('../controller/register.controller')

const definerole=require('../middleware/role/defineRole');
const verifyrole=require('../middleware/role/verifyRole');

router.post('/register/Warehouse',definerole('WAREHOUSE'),registerController.SignUp);
router.post('/register/Admin',definerole('ADMIN'),registerController.SignUp);
router.post('/register/USER',definerole('USER'),registerController.SignUp);
router.post('/login/Warehouse',verifyrole('WAREHOUSE'),registerController.login);
router.post('/login/Admin',verifyrole('ADMIN'),registerController.login);
router.post('/login/User',verifyrole('USER'),registerController.login);

module.exports=router;