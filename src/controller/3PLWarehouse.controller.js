const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
const {uploadBase64ToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
const { refreshToken } = require('firebase-admin/app');

// 3PL Warehouse CRUD
const Add3PLWarehouse=async(req,res,next)=>{
    const {company_details,warehouse_details,WTRA}=req.body

    // const {warehouseID}=req.params;

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }
    if(req.user.role === 'ADMIN')
    {
        isVerified=true;
    }
    else if(req.user.role === 'LISTER')
    {
        isVerified=false;
    }


    try 
    {
        let PL;
        let imageURL = [];
        let uploadResult;
        let link;
        
            if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
                await Promise.all(
                    req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
                        uploadResult = await uploadToFirebase(file);
                        link = uploadResult;
                        imageURL.push(link);
                    })
                );
                warehouse_details.WarehouseImage = imageURL;
            }        

            PL = new ThreePLWarehouse({
                Lister: req.user.id,
                isVerified,
                company_details,
                warehouse_details, 
                isFeatured:false,
                WTRA
            });

        
        // Save the PL object
        const data = await PL.save();
 
        return next(ApiResponses(201,data,'Warehouse 3PL Added Successfully'));

    } catch (error) {
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            console.log({ ERROR : error });
            return next(ApiErrors(500,errorMessages[0]));            
        }
        else if(error.code === 11000)
        {
            const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
            console.log(cinMatch[1]);
            if(error.errorResponse.errmsg.includes('mobileNo'))
            {
                console.log(error);
                return next(ApiErrors(500, `This Mobile no is already taken -: ${cinMatch[1]}`));
            }else if(error.errorResponse.errmsg.includes('GST_no'))
            { 
                console.log(error);
                return next(ApiErrors(500, `This GST no is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('CIN'))
            {   
                return next(ApiErrors(500, `This CIN Number is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('email'))
            {
                return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
            }
        }
        else
        {
            return next(ApiErrors(500,`Internal Serve Error, ${error}`));
        }
    }
}

const AllPLWarehouse=async(req,res,next)=>{

    const id=req.user.id;

    // const warehouse=await ThreePLWarehouse.find({ Lister: new mongoose.Types.ObjectId(id) }).populate({
    //     path: 'Lister',
    //     select: '-password -refreshToken'
    //   });

    const warehouse= await ThreePLWarehouse.aggregate([
        {
            $match:{
                Lister: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $project: {
                name: '$company_details.company_name',
                city: '$warehouse_details.warehouseAddress.city',
                price: '$warehouse_details.otherDetails.DepositRent',
                description: '$warehouse_details.otherDetails.DescribeFacility',
                image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] },
                type: '$type',
                isVerified : '$isVerified',
                isFeatured : '$isFeatured'
            }
        }
    ])

    if (warehouse.length === 0) {
        return next(ApiErrors(400,`No warehouse found with this Lister ID.`));
    }
    return next(ApiResponses(200,warehouse,'WareHouse List'));

}

const singlePLWarehouse=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide 3PL Warehouse id to search for 3PL Warehouse`)); 
    }
    try {
        const SinglePLWarehouse = await ThreePLWarehouse.findOne({ _id: id }); 

        if(!SinglePLWarehouse)
        {
            return next(ApiErrors(404,`3PL Warehouse with this id not found`));
        }
        return next(ApiResponses(200,SinglePLWarehouse,'3PL WareHouse Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving 3PL warehouse: ${error}`));
    }
}

const UpdatePLWarehouse= async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }

    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id of the 3PL Warehouse that you want to updated"));
    }
    try {

        const PLWarehouse=await ThreePLWarehouse.findById(id);
        if(!PLWarehouse)
        {
            return next(ApiErrors(404,"No 3PL Warehouse found with this id"));
        }


        const {company_details,warehouse_details,base64}=req.body

        let WarehouseImage=[];
        let imageURL=[]
        let link;
        let uploadResult;

        if(base64 && base64.length>0){
            await Promise.all(
                base64.map(async (file)=>{
                    uploadResult = await uploadBase64ToFirebase(file);
                    // return res.json(uploadResult);

                    link = uploadResult;
                    imageURL.push(link);
                })
            )
        }


        if(imageURL.length > 0)
        {
            WarehouseImage = [...req.body.warehouse_details.WarehouseImage,...imageURL];            
        }
        else if(req.body.warehouse_details && req.body.
            warehouse_details.WarehouseImage)
        {
            // return res.json('Hello');
            if(req.body.warehouse_details.WarehouseImage.length > 0)
            {
                WarehouseImage = [...req.body.
                    warehouse_details.WarehouseImage];
            }
            else{
                return next(ApiErrors(400,'Your Warehouse Image section is Empty please Upload some 3PL Warehouse image'));
            }
        } else if(req.body.warehouse_details && !req.body.
            warehouse_details.WarehouseImage){
                WarehouseImage = PLWarehouse.warehouse_details.WarehouseImage
            }
    
        if(Object.keys(company_details || {}).length > 0 || Object.keys(warehouse_details || {}).length > 0)
        {
            if(company_details)
            {
                PLWarehouse.company_details= {...PLWarehouse.company_details.toObject(), ...company_details}
            }

            if(warehouse_details)
            {
                warehouse_details.WarehouseImage=[...WarehouseImage];
                PLWarehouse.warehouse_details = {...PLWarehouse.warehouse_details.toObject(), ...warehouse_details}
            }

            await PLWarehouse.validate();

            // const UpdatedPLWarehouse=await PLWarehouse.save();

            const UpdatedPLWarehouse = await ThreePLWarehouse.findByIdAndUpdate
            (
                id,
                {
                    $set:{
                        ...(company_details ? {company_details: PLWarehouse.company_details} : {}),
                        ...(warehouse_details ? {warehouse_details: PLWarehouse.warehouse_details} : {})
                    },
                },
                {
                 new: true,
                }
            );

            if (!UpdatedPLWarehouse) {
                return next(ApiErrors(404,'Warehouse not found'))
            }
            return next(ApiResponses(200,UpdatedPLWarehouse ,'3PL Warehouse updated successfully'));
        }
        return next(ApiErrors(400,'Provide the data that you want to updated'));
    } catch (error) {
        if(error.name === 'ValidationError')
            {
                const errorMessages = Object.values(error.errors).map(error => error.message);
                console.log(error);
                return next(ApiErrors(500,errorMessages[0]));            
            }
            else if(error.code === 11000)
                {
                    const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
                    console.log(cinMatch[1]);
                    if(error.errorResponse.errmsg.includes('mobileNo'))
                    {
                        console.log(error);
                        return next(ApiErrors(500, `This Mobile no is already taken -: ${cinMatch[1]}`));
                    }else if(error.errorResponse.errmsg.includes('GST_no'))
                    { 
                        console.log(error);
                        return next(ApiErrors(500, `This GST no is already taken -: ${cinMatch[1]}`));
                    }
                    else if(error.errorResponse.errmsg.includes('CIN'))
                    {   
                        return next(ApiErrors(500, `This CIN Number is already taken -: ${cinMatch[1]}`));
                    }
                    else if(error.errorResponse.errmsg.includes('email'))
                    {
                        return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
                    }
                }
            else
            {
                console.error('Error updating warehouse:', error);
                return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message}`));
            }    
    }
}

const DeletePLWarehouse=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Remove 3PL Warehouse"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to  the Remove 3PL Warehouse"));
    }
    try {
        const removePLWarehouse=await ThreePLWarehouse.findByIdAndDelete(id);

        if (removePLWarehouse){
            return next(ApiResponses(200,[],"3PL Warehouse deleted successfully"));
        } else {
            return next(ApiErrors(404,"No warehouse found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error While Deleting 3PL Warehouse:', error);
        return next(ApiErrors(500,`Internal Server Error, Error -: ${error.message} `));  
    }   
}

module.exports={
    Add3PLWarehouse,
    AllPLWarehouse,
    singlePLWarehouse,
    UpdatePLWarehouse,
    DeletePLWarehouse
}


// const UpdatePLWarehouse= async(req,res,next)=>{
//     const checkUser=await Register.findOne({_id:req.user.id});

//     if(!checkUser)
//     {
//         return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
//     }
//     if(req.user.id != checkUser._id)
//     {
//         return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Update 3PL Warehouse"));
//     }

//     const id=req.query.id;

//     if(!id)
//     {
//         return next(ApiErrors(400,"Provide id of the Listed 3PL Warehouse that you want to updated"));
//     }
//     try {

//         const PLWarehouse=await ThreePLWarehouse.findById(id);
//         if(!PLWarehouse)
//         {
//             return next(ApiErrors(404,"No 3PL Warehouse found with this id"));
//         }
//         const {company_details,warehouse_details,base64}=req.body
        
//         let WarehouseImage=[];
//         let valueAddedServices=[];
//         let features=[];
//         let warehouseContact=[];
//         let imageURL=[];
//         let link;
//         let uploadResult;

//         if(base64 && base64.length>0){
//             await Promise.all(
//                 base64.map(async (file)=>{
//                     uploadResult = await uploadBase64ToFirebase(file);
//                     // return res.json(uploadResult);

//                     link = uploadResult;
//                     imageURL.push(link);
//                 })
//             )
//         }

//         if(imageURL.length > 0)
//         {
//             WarehouseImage = [...req.body.warehouse_details.WarehouseImage,...imageURL];
//         }
//         else if(req.body.warehouse_details && req.body.warehouse_details.WarehouseImage)
//         {
//             // return res.json('Hello');
//             if(req.body.warehouse_details.WarehouseImage.length > 0)
//             {
//                 WarehouseImage = [...req.body.warehouse_details.WarehouseImage];
//             }
//             else{
//                 return next(ApiErrors(400,'Your Warehouse Image section is Empty please Upload some 3PL Warehouse image'));
//             }
//         } else if(req.body.warehouse_details && !req.body.
//             warehouse_details.WarehouseImage){
//                 WarehouseImage = PLWarehouse.warehouse_details.WarehouseImage
//             }
        
//         //  return res.json(PLWarehouse.warehouse_details);
    
//         if(Object.keys(company_details || {}).length > 0 || Object.keys(warehouse_details || {}).length > 0)
//         {
//             if(company_details)
//             {
//                PLWarehouse.company_details= {...PLWarehouse.company_details.toObject(), ...company_details}
//             }

//             if(warehouse_details)
//             {
//                 // return res.json();
//                 if(Object.keys(warehouse_details.otherDetails || {}).length > 0)
//                 {
//                     PLWarehouse.warehouse_details.otherDetails = {...PLWarehouse.warehouse_details.otherDetails.toObject(), ...warehouse_details.otherDetails};
//                 }
//                 if(Object.keys(warehouse_details.Storage || {}).length > 0)
//                 {
//                     PLWarehouse.warehouse_details.Storage = {...PLWarehouse.warehouse_details.Storage.toObject(), ...warehouse_details.Storage};
//                 }
//                 if(Object.keys(warehouse_details.Financials || {}).length > 0)
//                 {
//                     PLWarehouse.warehouse_details.Financials = {...PLWarehouse.warehouse_details.Financials.toObject(), ...warehouse_details.Financials};
//                 }
//                 if(Object.keys(warehouse_details.warehouseAddress || {}).length > 0)
//                 {
//                     PLWarehouse.warehouse_details.warehouseAddress = {...PLWarehouse.warehouse_details.warehouseAddress.toObject(), ...warehouse_details.warehouseAddress};
//                 }
//                 if(warehouse_details.valueAddedServices.length > 0)
//                 {
//                     // return res.json(warehouse_details.valueAddedServices.length);
//                     valueAddedServices=[...req.body.warehouse_details.valueAddedServices];
//                     PLWarehouse.warehouse_details.valueAddedServices=[...valueAddedServices];
//                     // return res.json(warehouse_details.valueAddedServices);
//                 }
//                 if(warehouse_details.features.length > 0)
//                 {
//                     features=[...req.body.warehouse_details.features];
//                     PLWarehouse.warehouse_details.features=[...features];
//                     // return res.json(warehouse_details.valueAddedServices);
//                 }
//                 if(warehouse_details.warehouseContact.length > 0)
//                 {
//                     warehouseContact=[...req.body.warehouse_details.warehouseContact];
//                     PLWarehouse.warehouse_details.warehouseContact=[...warehouseContact];
//                     // return res.json(warehouse_details.valueAddedServices);
//                 }

//                 // PLWarehouse.warehouse_details = {...PLWarehouse.warehouse_details.toObject(), ...warehouse_details}
//                 warehouse_details.WarehouseImage=[...WarehouseImage];

//                 // return res.json( PLWarehouse.warehouse_details);

//             }

//             await PLWarehouse.validate();

//             // const UpdatedPLWarehouse=await PLWarehouse.save();

//             const UpdatedPLWarehouse = await ThreePLWarehouse.findByIdAndUpdate
//             (
//                 id,
//                 {
//                     $set:{
//                         ...(company_details ? {company_details: PLWarehouse.company_details} : {}),
//                         ...(warehouse_details ? {warehouse_details: PLWarehouse.warehouse_details} : {})
//                     },
//                 },
//                 {
//                  new: true,
//                 }
//             );

//             if (!UpdatedPLWarehouse) {
//                 return next(ApiErrors(404,'Warehouse not found'))
//             }
//             return next(ApiResponses(200,UpdatedPLWarehouse ,'3PL Warehouse updated successfully'));
//         }
//         return next(ApiErrors(400,'Provide the data that you want to updated'));
//     } catch (error) {
//         if(error.name === 'ValidationError')
//             {
//                 const errorMessages = Object.values(error.errors).map(error => error.message);
//                 console.log(error);
//                 return next(ApiErrors(500,errorMessages[0]));            
//             }
//             else if(error.code === 11000)
//                 {
//                     const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
//                     console.log(cinMatch[1]);
//                     if(error.errorResponse.errmsg.includes('mobileNo'))
//                     {
//                         console.log(error);
//                         return next(ApiErrors(500, `This Mobile no is already taken -: ${cinMatch[1]}`));
//                     }else if(error.errorResponse.errmsg.includes('GST_no'))
//                     { 
//                         console.log(error);
//                         return next(ApiErrors(500, `This GST no is already taken -: ${cinMatch[1]}`));
//                     }
//                     else if(error.errorResponse.errmsg.includes('CIN'))
//                     {   
//                         return next(ApiErrors(500, `This CIN Number is already taken -: ${cinMatch[1]}`));
//                     }
//                     else if(error.errorResponse.errmsg.includes('email'))
//                     {
//                         return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
//                     }
//                 }
//             else
//             {
//                 console.error('Error updating warehouse:', error);
//                 return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message}`));
//             }    
//     }
// }
