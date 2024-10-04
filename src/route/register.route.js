const express=require('express');

const router=express.Router();

const registerController=require('../controller/register.controller')

const definerole=require('../middleware/role/defineRole');
const {verifyRole}=require('../middleware/role/verifyRole');

const {verify}=require('../middleware/token/verifyToken')

// router.post('/register/Lister',definerole('LISTER'),registerController.SignUp);

// router.post('/login/Lister',verifyRole('LISTER'),registerController.login);

router.post('/register/Admin',definerole('ADMIN'),registerController.SignUp);

router.post('/login/Admin',verifyRole('ADMIN'),registerController.login);

router.get('/profile',verify(['LISTER', 'ADMIN']),registerController.profile);

router.put('/update',verify(['LISTER', 'ADMIN']),registerController.update);

router.put('/Update/Password',verify(['LISTER', 'ADMIN']),registerController.UpdatePassword);

router.get('/Check/Email',registerController.EmailCheck);

router.get('/Check/Contact',registerController.ContactCheck);



// router.post('/register/USER',definerole('USER'),registerController.SignUp);
// router.post('/login/User',verifyRole('USER'),registerController.login);

module.exports=router;