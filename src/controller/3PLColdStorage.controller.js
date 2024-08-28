const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
const {uploadBase64ToFirebase} = require('../middleware/ImageUpload/firebaseConfig');

// 3PL ColdStorage CRUD
const Add3PLColdStorage=async(req,res,next)=>{
    const {company_details, cold_storage_details}=req.body

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
    try 
    {

        let PL;
        // let imageURL = [];
        // let uploadResult;
        // let link;
    
            // if(req.files && req.files['cold_storage_details[ColdStorageImage]'] && req.files['cold_storage_details[ColdStorageImage]'].length > 0) {
            //     await Promise.all(
            //         req.files['cold_storage_details[ColdStorageImage]'].map(async (file) => {
            //             uploadResult = await uploadToFirebase(file);
            //             link = uploadResult;
            //             imageURL.push(link);
            //         })
            //     );
            // } 
            // else {
            //     return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
            // }
        
            // cold_storage_details.ColdStorageImage = imageURL;

        PL = new ThreePLColdstorage({
            wareHouseLister: req.user.id,
            company_details,
            cold_storage_details
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

const AllPLColdStorage=async(req,res,next)=>{
    const id=req.user.id;
    // try {
        ThreePLColdstorage.find({ wareHouseLister: new mongoose.Types.ObjectId(id) })
        .populate('wareHouseLister') // Optional: populate the referenced Register data
        .then((coldstorage) => {
            if (coldstorage.length === 0) {
                return next(ApiErrors(400,`No 3PL Cold Storage found with this wareHouseLister ID.`));
            }
            return next(ApiResponses(200,coldstorage,'3PL Cold Storage List'));
        })
        .catch((err) => {
            return next(ApiErrors(500,`Error finding 3PL ColdStorage: ${err}`));
        });
}

const singlePLColdStorage=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide 3PL ColdStorage id to search for Cold Storage`)); 
    }
    try {
        const SinglePLColdStorage = await ThreePLColdstorage.findOne({ _id: id }); 

        if(!SinglePLColdStorage)
        {
            return next(ApiErrors(404,`3PL Cold Storage with this id not found`));
        }
        return next(ApiResponses(200,SinglePLColdStorage,'3PL ColdStorage Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving 3PL Coldstorage: ${error}`));
    }
}

const UpdatePLColdStorage= async(req,res,next)=>{
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
        return next(ApiErrors(400,"Provide id of the 3PL Cold Storage that you want to updated"));
    }
    try {
        const PLColdStorage=await ThreePLColdstorage.findById(id);
        if(!PLColdStorage)
            {
                return next(ApiErrors(404,"No 3PL ColdStorage found with this id"));
            }
    
        const {company_details,cold_storage_details, base64}=req.body;

        let ColdStorageImage=[];
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
            ColdStorageImage = [...req.body.
                cold_storage_details.ColdStorageImage,...imageURL];            
        }
        else if(req.body.cold_storage_details && req.body.cold_storage_details.ColdStorageImage)
        {
            // return res.json('Hello');
            if(req.body.cold_storage_details.ColdStorageImage.length > 0)
            {
                ColdStorageImage = [...req.body.cold_storage_details.ColdStorageImage];
            }
            else{
                return next(ApiErrors(400,'Your Cold Storage Image section is Empty please Upload some ColdStorage image'));
            }
        }    

        // return res.json(PLColdStorage.cold_storage_details);

        if(Object.keys(company_details || {} ).length > 0 || Object.keys(cold_storage_details || {}).length > 0){
        
            if(company_details)
            {
                PLColdStorage.company_details= {...PLColdStorage.company_details.toObject(), ...company_details}
            }
            if(cold_storage_details)
            {
                cold_storage_details.ColdStorageImage=[...ColdStorageImage];
                PLColdStorage.cold_storage_details = {...PLColdStorage.cold_storage_details.toObject(), ...cold_storage_details}
            }

            await PLColdStorage.validate();

            const UpdatedPLColdStorage=await PLColdStorage.save();

            if (!UpdatedPLColdStorage) {
                return next(ApiErrors(404,'Warehouse not found'))
              }
              return next(ApiResponses(200,UpdatedPLColdStorage ,'3PL Cold Storage updated successfully'));
        }
        return next(ApiErrors(400,'Provide the data that you want to updated'));
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
                console.error('Error Updating ColdStorage:', error);
                return next(ApiErrors(500,`Internal Serve Error, Error -: ${error}`));
            }    
    }
}

const DeletePLColdStorage=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to delete 3PL Cold Storage"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to delete the 3PL Cold Storage"));
    }
    try {
        const removePLColdStorage=await ThreePLColdstorage.findByIdAndDelete(id);

        if (removePLColdStorage){
            return next(ApiResponses(200,"3PL Cold Storage deleted successfully"));
        } else {
            return next(ApiErrors(404,"No 3PL Cold Storage found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error While Deleting 3PL Cold Storage:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `));  
    }   
}

module.exports={
    Add3PLColdStorage,
    AllPLColdStorage,
    singlePLColdStorage,
    UpdatePLColdStorage,
    DeletePLColdStorage
}