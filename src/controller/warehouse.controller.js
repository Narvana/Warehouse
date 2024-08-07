const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadOnCloudinary} = require('../middleware/ImageUpload/cloudinaryConfig');

const AddWareHouse=async(req,res,next)=>{

    const {basicInfo,layout,floorRent}=req.body

    // const {warehouseID}=req.params;

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    // return res.json(req.user.id);

    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }
    if(req.user.role !== req.role)
    {
        return next(ApiErrors(403,"Unauthorized User. Only user assign with Warehouse role can access this"));
    }
    if(!basicInfo || !layout || !floorRent){
        return next(ApiErrors(400,`All Feilds are required`));
    } 
    try {
        let imageURL=[]
        let link;
        let uploadResult;
         
        if(req.files && req.files.wareHouseImage && req.files.wareHouseImage.length > 0){
            await Promise.all(
                req.files.wareHouseImage.map(async (file)=>{
                    uploadResult= await uploadOnCloudinary(file.path);
                    link= uploadResult.url;
                    imageURL.push(link);
                })
            )
         }else{
            return next(ApiErrors(400,"No file uploaded. Please upload some pictures"));
         }
        const warehouse=new Warehouse({
            wareHouseLister:req.user.id,
            basicInfo,
            layout,
            floorRent,
            wareHouseImage: imageURL
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
            return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `));
        }
    }
}

const allWareHouse=async(req,res,next)=>{
    // const {wareHouseID}=req.params;
    try {
        const warehouses=await Warehouse.find();
        if(!warehouses)
        {
            return next(ApiErrors(400, `No Warehouse found`)); 
        }
        return next(ApiResponses(200,warehouses,'List of All Warehouse'))
    } catch (error) {
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `)); 
    }
}

const getWarehouse=async(req,res,next)=>{
    const id=req.user.id;
    // try {
        Warehouse.find({ wareHouseLister: new mongoose.Types.ObjectId(id) })
        .populate('wareHouseLister') // Optional: populate the referenced Register data
        .then((warehouse) => {
            if (!warehouse) {
                return next(ApiErrors(400,`No warehouse found with this wareHouseLister ID.`));
            }
            return next(ApiResponses(200,warehouse,'WareHouse List'));
        })
        .catch((err) => {
            return next(ApiErrors(500,`Error finding warehouse: ${err}`));
        });
}

module.exports={
    AddWareHouse,
    allWareHouse,
    getWarehouse
}