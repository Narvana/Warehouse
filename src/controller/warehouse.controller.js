const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
const {uploadBase64ToFirebase}= require('../middleware/ImageUpload/firebaseConfig');

// WAREHOUSE CRUD
const AddWareHouse=async(req,res,next)=>{

    const {basicInfo,layout,floorRent,wareHouseDescription,WTRA
    }=req.body

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
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
    
    try {
        let imageURL=[]
        let link;
        let uploadResult;
    
        if(req.files && req.files.wareHouseImage && req.files.wareHouseImage.length > 0){
            await Promise.all(
                req.files.wareHouseImage.map(async (file)=>{
                    
                    uploadResult = await uploadToFirebase(file);
                  
                    link = uploadResult; 
                    imageURL.push(link);
                })
            )
         }

        
        const warehouse=new Warehouse({
            Lister:req.user.id,
            isVerified,
            isFeatured:false,
            basicInfo,
            layout,
            floorRent,
            wareHouseDescription,
            wareHouseImage: imageURL,
            WTRA
        })
    
        const data=await warehouse.save();

        return next(ApiResponses(201,data,'WareHouse Added Successfully')); 

    } catch (error) {
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiErrors(500,errorMessages[0]));            
        }
        else if(error.code === 11000)
            {
                const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
                console.log(cinMatch[1]);
                if(error.errorResponse.errmsg.includes('contactNo'))
                {
                    console.log(error);
                    return next(ApiErrors(500, `This Contact no is already taken -: ${cinMatch[1]}`));
                }
                else if(error.errorResponse.errmsg.includes('email'))
                {
                    return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
                }
            }
        else
        {
            console.log(`Internal Serve Error, Error -: ${error} `);
            
            return next(ApiErrors(500,`Internal Server Error, Error -: ${error} `));
        }
    }
}

const getListerAllWarehouse=async(req,res,next)=>{
    
    const id=req.user.id;
    
    try {
        // const warehouse=await Warehouse.find({ Lister: new mongoose.Types.ObjectId(id) }).populate({
        //     path:"Lister",
        //     select:("-password -refreshToken")
        // });

        const warehouse = await Warehouse.aggregate([
            {
                $match:{
                    'Lister' :  new mongoose.Types.ObjectId(id) 
                }
            },
            {
                $project : {
                    name: '$basicInfo.name',
                    city: '$basicInfo.city',
                    price: '$floorRent.expectedRent',
                    description: '$wareHouseDescription',
                    image: { $arrayElemAt: ['$wareHouseImage', 0] },
                    type: '$type',
                    isVerified : '$isVerified',
                    isFeatured : '$isFeatured',
                    WTRA: '$WTRA'
                }
            }
        ]);
    
        if (warehouse.length === 0) {
            return next(ApiErrors(400,`No warehouse found with this Lister ID.`));
        }
        return next(ApiResponses(200,warehouse,'WareHouse List'));
            
    } catch (error) {
        console.log(error);
        return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));   
    }

}

const singleWareHouse=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide Warehouse id to search for Warehouse`)); 
    }
    try {
        const SingleWarehouse = await Warehouse.findOne({ _id: id }); 

        if(!SingleWarehouse)
        {
            return next(ApiErrors(404,`Warehouse with this id not found`));
        }
        return next(ApiResponses(200,SingleWarehouse,'WareHouse Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));
    }
}

const UpdateWarehouse=async(req,res,next)=>{

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }

    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to update the Warehouse"));
    }
    try 
    {
        const warehouse=await Warehouse.findById(id);
        if(!warehouse)
        {
            return next(ApiErrors(404,"No Warehouse found with this id"));
        }

        const {basicInfo, layout, floorRent, base64} = req.body;

        let wareHouseImage=[];
        let imageURL=[]
        let link;
        let uploadResult;

        if(base64 && base64.length>0){
            await Promise.all(
                base64.map(async (file)=>{
                    uploadResult = await uploadBase64ToFirebase(file);
                    link = uploadResult;
                    imageURL.push(link);
                })
            )
        }

        if(imageURL.length > 0)
        {
            wareHouseImage = [...req.body.wareHouseImage,...imageURL];            
        }
        else if(req.body.wareHouseImage)
        {
            if(req.body.wareHouseImage.length > 0)
            {
                wareHouseImage = [...req.body.wareHouseImage];          
            }
            else
            {
                return next(ApiErrors(400,'Your Warehouse Image section is Empty please Upload some Warehouse image'));
            }
        }
        else if(!req.body.wareHouseImage)
        {
            wareHouseImage=warehouse.wareHouseImage;
        }

        if(
            Object.keys(basicInfo || {}).length > 0 
            || 
            Object.keys(layout || {}).length > 0 
            || 
            Object.keys(floorRent || {}).length > 0 
            || 
            req.body.wareHouseImage 
        )
        {   
            if (basicInfo) {

                warehouse.basicInfo = { ...warehouse.basicInfo.toObject(), ...basicInfo };
            }

            if (layout) {
                warehouse.layout = { ...warehouse.layout.toObject(), ...layout };
            }
    
            if (floorRent) {
                warehouse.floorRent = { ...warehouse.floorRent.toObject(), ...floorRent };
            }

            if(wareHouseImage)
            {
                warehouse.wareHouseImage = [...wareHouseImage];
            }

            await warehouse.validate(); 

            const updatedWarehouse = await Warehouse.findByIdAndUpdate(
                id,
                {
                    $set: { 
                        ...(basicInfo ? { basicInfo: warehouse.basicInfo } : {}),
                        ...(layout ? { layout: warehouse ? warehouse.layout : layout } : {}),
                        ...(floorRent ? { floorRent: warehouse ? warehouse.floorRent : floorRent } : {}),
                        ...(wareHouseImage ?  { wareHouseImage: warehouse.wareHouseImage } : [])
                    },
                },
                {
                    new: true
                    // runValidators: !needsComplexUpdate, // Skip validation if it has already been done
                }
            );
  
             if (!updatedWarehouse) {
                return res.status(404).json({ error: 'Warehouse not found' });
              }
              return next(ApiResponses(200,updatedWarehouse ,'Warehouse updated successfully'));
        }         
        return next(ApiErrors(400,'Provide the data that you want to updated'));

    } catch (error) 
    {

        if(error.name === 'ValidationError')
            {
                const errorMessages = Object.values(error.errors).map(error => error.message);
                return next(ApiErrors(500,errorMessages[0]));            
            }
            else if(error.code === 11000)
                {
                    const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
                    console.log(cinMatch[1]);
                    if(error.errorResponse.errmsg.includes('contactNo'))
                    {
                        console.log(error);
                        return next(ApiErrors(500, `This Contact no is already taken -: ${cinMatch[1]}`));
                    }
                    else if(error.errorResponse.errmsg.includes('email'))
                    {
                        return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
                    }
                }
    
            else
            {
                console.error('Error updating warehouse:', error);
                return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `));
            }    
    }
}



const DeleteWarehouse=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to remove Listing"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to Remove the Warehouse"));
    }
    try {
        const removeWarehouse=await Warehouse.findByIdAndDelete(id);

        if (removeWarehouse){
            return next(ApiResponses(200,[],"Warehouse deleted successfully"));
        } else {
            return next(ApiErrors(404,"No warehouse found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error Removing warehouse:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message}`));  
    }   
}


// const CheckValidation=async(req,res,next)=>{

//     const validate=req.query;



// }


// ADD3PL
const Add3PL=async(req,res,next)=>{
    const {company_details,warehouse_details, cold_storage_details}=req.body

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
    if(req.user.role !== req.role)
    {
        return next(ApiErrors(403,"Unauthorized User. Only user assign with Warehouse role can access this"));
    }
    // if(!basicInfo || !layout || !floorRent){
    //     return next(ApiErrors(400,`All Feilds are required`));
    // } 
    try 
    {
        let PL;
        let imageURL = [];
        let uploadResult;
        let link;
        
        // if(warehouse_details) {
        //     // Handle warehouse image uploads
        //     if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
        //         await Promise.all(
        //             req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
        //                 uploadResult = await uploadToFirebase(file);
        //                 link = uploadResult;
        //                 imageURL.push(link);
        //             })
        //         );
        //     } else {
        //         return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
        //     }
        
        //     warehouse_details.WarehouseImage = imageURL;
        // }
        
        // if (warehouse_details && cold_storage_details) {
        //     // Both warehouse and cold storage details exist
        //     PL = new ThreePL({
        //         Lister: req.user.id,
        //         company_details,
        //         warehouse_details,
        //         cold_storage_details,
        //     });
        // } else if (warehouse_details) {
        //     // Only warehouse details exist
        //     PL = new ThreePL({
        //         Lister: req.user.id,
        //         company_details,
        //         warehouse_details,
        //     });
        // } else if (cold_storage_details) {
        //     // Only cold storage details exist
        //     PL = new ThreePL({
        //         Lister: req.user.id,
        //         company_details,
        //         cold_storage_details,
        //     });
        // } else {
        //     return next(ApiErrors(400, "No valid details provided."));
        // }

        if(warehouse_details) {
            // Handle warehouse image uploads
            if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
                await Promise.all(
                    req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
                        uploadResult = await uploadToFirebase(file);
                        link = uploadResult;
                        imageURL.push(link);
                    })
                );
            } else {
                return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
            }
        
            warehouse_details.WarehouseImage = imageURL;
        }
        
        if (warehouse_details && cold_storage_details) {
            // Both warehouse and cold storage details exist
            PL = new ThreePL({
                Lister: req.user.id,
                company_details,
                warehouse_details,
                cold_storage_details,
            });
        } else if (warehouse_details) {
            // Only warehouse details exist
            PL = new ThreePL({
                Lister: req.user.id,
                company_details,
                warehouse_details,
            });
        } else if (cold_storage_details) {
            // Only cold storage details exist
            PL = new ThreePL({
                Lister: req.user.id,
                company_details,
                cold_storage_details,
            });
        } else {
            return next(ApiErrors(400, "No valid details provided."));
        }

        
        // Save the PL object
        const data = await PL.save();
 
        return next(ApiResponses(201,data,'3PL Added Successfully'));

    } catch (error) {
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            console.log({ ERROR : error });
            return next(ApiErrors(500,errorMessages[0]));            
        }
        else if(error.code === 11000)
        {
            if(error.errorResponse.errmsg.includes('mobileNo'))
            {
                console.log(error);
                return next(ApiErrors(500, `This Mobile no is already taken -: ${error.errorResponse.errmsg}`));
            }else if(error.errorResponse.errmsg.includes('GST_no'))
            { 
                console.log(error);
                return next(ApiErrors(500, `This GST no is already taken -: ${error.errorResponse.errmsg}`));
            }
            else if(error.errorResponse.errmsg.includes('CIN'))
                {
                    console.log(error);
                    return next(ApiErrors(500, `This CIN is already taken -: ${error.errorResponse.errmsg}`));
                }
            else if(error.errorResponse.errmsg.includes('email'))
                {
                    console.log(error);
                    return next(ApiErrors(500, `This email is already taken -: ${error.errorResponse.errmsg}`));
                }
        }
        else
        {
            return next(ApiErrors(500,`Internal Serve Error, ${error}`));
        }
    }
   
}

module.exports={
    AddWareHouse,
    getListerAllWarehouse,
    singleWareHouse,
    UpdateWarehouse,
    DeleteWarehouse,
    Add3PL,
}

