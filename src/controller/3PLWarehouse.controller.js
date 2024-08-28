const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');


// 3PL Warehouse CRUD
const Add3PLWarehouse=async(req,res,next)=>{
    const {company_details,warehouse_details}=req.body

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
    if(!company_details || !warehouse_details){
        return next(ApiErrors(400,`All Feilds are required`));
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
            } else {
                return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
            }
        
            warehouse_details.WarehouseImage = imageURL;

            PL = new ThreePLWarehouse({
                wareHouseLister: req.user.id,
                company_details,
                warehouse_details,
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

const AllPLWarehouse=async(req,res,next)=>{
    const id=req.user.id;
    // try {
        ThreePLWarehouse.find({ wareHouseLister: new mongoose.Types.ObjectId(id) })
        .populate('wareHouseLister') // Optional: populate the referenced Register data
        .then((warehouse) => {
            if (warehouse.length === 0) {
                return next(ApiErrors(400,`No 3PL warehouse found with this wareHouseLister ID.`));
            }
            return next(ApiResponses(200,warehouse,' 3PL WareHouse List'));
        })
        .catch((err) => {
            return next(ApiErrors(500,`Error finding 3PL warehouse: ${err}`));
        });
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
    if(req.user.role !== req.role)
    {
        return next(ApiErrors(403,"Unauthorized User. Only user assign with Warehouse role can access this"));
    }

    try {
        const {company_details,warehouse_details}=req.body
        
        const PLWarehouse=await ThreePLWarehouse.findById({_id:id});

        if((company_details ? Object.keys(company_details).length > 0 : null ) || (warehouse_details ? Object.keys(warehouse_details).length > 0 : null)){
        
            if(company_details)
            {
                PLWarehouse.company_details= {...PLWarehouse.company_details, ...company_details}
            }
            if(warehouse_details)
            {
                PLWarehouse.warehouse_details = {...PLWarehouse.warehouse_details, ...warehouse_details}
            }

            await PLWarehouse.validate();

            const UpdatedPLWarehouse=await PLWarehouse.save();

            if (!UpdatedPLWarehouse) {
                return next(ApiErrors(404,'Warehouse not found'))
              }
              return next(ApiResponses(200,UpdatedPLWarehouse ,'3PL Warehouse updated successfully'));
        }
    } catch (error) {
        if(error.name === 'ValidationError')
            {
                const errorMessages = Object.values(error.errors).map(error => error.message);
                return next(ApiErrors(500,errorMessages[0]));            
            }
            else if(error.code === 11000)
            {
                if(error.errorResponse.errmsg.includes('contactNo'))
                {
                    return next(ApiErrors(500, `This Contact no is already taken`));
                }else if(error.errorResponse.errmsg.includes('email'))
                {
                    return next(ApiErrors(500, `This Email is already taken`));
                }
            }
            else
            {
                console.error('Error updating warehouse:', error);
                return next(ApiErrors(500,`Internal Serve Error, Error -: ${error}`));
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
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to update the Warehouse"));
    }
    try {
        const removePLWarehouse=await ThreePLWarehouse.findByIdAndDelete(id);

        if (removePLWarehouse){
            return next(ApiResponses(200,"Warehouse deleted successfully"));
        } else {
            return next(ApiErrors(404,"No warehouse found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error While Deleting 3PL Warehouse:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `));  
    }   
}

module.exports={
    Add3PLWarehouse,
    AllPLWarehouse,
    singlePLWarehouse,
    UpdatePLWarehouse,
    DeletePLWarehouse
}