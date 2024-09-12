const mongoose=require('mongoose')
const Warehouse = require('../model/warehouse.model');
const Register = require('../model/register.model');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const LandModel=require('../model/Land.model');
const {uploadToFirebase,uploadBase64ToFirebase} = require('../middleware/ImageUpload/firebaseConfig')

const AddLand=async(req,res,next)=>{

    const {basicInfo,landInfo,AdditionalDetails}=req.body;

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
    else if(req.user.role === 'LISTER') //LISTER
    {
        isVerified=false;
    }

    try {
        let imageURL = [];
        let uploadResult;
        let link;
        
        if(req.files && req.files['LandImage'] && req.files['LandImage'].length > 0) {
            await Promise.all(
                req.files['LandImage'].map(async (file) => {
                    uploadResult = await uploadToFirebase(file);
                    link = uploadResult;
                    imageURL.push(link);
                })
            );
        }        

        const Land=new LandModel({
            Lister: req.user.id,
            isVerified,
            isFeatured:false,
            basicInfo,
            landInfo,
            AdditionalDetails,
            LandImage:imageURL,
        })

        const data= await Land.save();

        return next(ApiResponses(201,data,'Land Added Successfully'));

    } 
    catch (error)
    {
        if(error.name === 'ValidationError')
            {
                const errorMessages = Object.values(error.errors).map(error => error.message);
                console.log({ ERROR : error });
                return next(ApiErrors(500,errorMessages[0]));            
            }
            else if(error.code === 11000)
            {
                const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);

                // console.log(cinMatch[1]);

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
                console.log({ ERROR : error });
                return next(ApiErrors(500,`Internal Serve Error, ${error.message}`));
            }
    }
}

const AllLandLister = async(req,res,next)=>{
    const id=req.user.id;

    const Land=await LandModel.aggregate([
        {
            $match:{
                Lister: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $project:{
                name: '$basicInfo.name',
                city: '$basicInfo.city',
                price: '$AdditionalDetails.SalePrice',
                description: '$AdditionalDetails.SpecialRemark',
                image: { $arrayElemAt: ['$LandImage', 0] },
                type: '$type',
                isVerified : '$isVerified',
                isFeatured : '$isFeatured',
                WTRA: { $ifNull: ['$WTRA', null] }
            }
        }
    ]);

    if(Land.length > 0)
    {
        return next(ApiResponses(200,Land,`Lister ${req.user.name} Land List`)); 
    }
    return next(ApiErrors(400,`No Land found with Lister ${req.user.name}.`));
}

const ListerSingleLand= async(req,res,next)=>{

    const id = req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,`Provide Listed Land id`)); 
    }
    try {
        const Land = await LandModel.findById(id);

        if(Land){
            return next(ApiResponses(200,Land,'3PL Land Details'));   
        }
        return next(ApiErrors(404,`Land with provided id not found`));
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving Land: ${error.message}`));
    }
}

const UpdateListedLand=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Update 3PL Warehouse"));
    }

    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id of the Listed Land that you want to updated"));
    }
    try {
        const Land = await LandModel.findById(id);

        if(!Land){
            return next(ApiErrors(404,"No Land found with this id"));
        }
        const {basicInfo, landInfo, AdditionalDetails, base64} = req.body;

        let LandImage = [];
        let imageURL = []
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
           LandImage = [...req.body.LandImage, ...imageURL];
        }
        else if(req.body.LandImage)
        {
            // if(req.body.)
            if(req.body.LandImage.length > 0)
            {
                LandImage= [...req.body.LandImage]
            }
            else{
                return next(ApiErrors(400,'Your Land Image section is Empty please Upload some Land Image'));
            }
        }
        else if(!req.body.LandImage)
        {
            LandImage = Land.LandImage
        }

        if( Object.keys(basicInfo || {}).length > 0 
        || 
        Object.keys(landInfo || {}).length > 0 
        || 
        Object.keys(AdditionalDetails || {}).length > 0 
        || 
        req.body.LandImage)
        {
            if(basicInfo)
            {
                Land.basicInfo = { ...Land.basicInfo.toObject(), ...basicInfo};
            }

            if(landInfo)
            {
                Land.landInfo = { ...Land.landInfo.toObject(), ...landInfo};
            }
            
            if(AdditionalDetails)
            {
                Land.AdditionalDetails = { ...Land.AdditionalDetails.toObject(), ...AdditionalDetails};
            }

            if(LandImage)
            {
                    Land.LandImage = [...LandImage];
            }

            await Land.validate();
            
            const updateLand= await LandModel.findByIdAndUpdate(id,{
                $set:{
                    ...(basicInfo ? { basicInfo: Land.basicInfo } : {}),
                    ...(landInfo ? { landInfo: Land ? Land.landInfo : landInfo } : {}),
                    ...(AdditionalDetails ? { AdditionalDetails: Land ? Land.AdditionalDetails : AdditionalDetails } : {}),
                    ...( LandImage ?  { LandImage: Land.LandImage } : [])
                }
            },{
                new: true
            });

            if (!updateLand) {
                return res.status(404).json({ error: 'Land not found' });
              }
              return next(ApiResponses(200,updateLand,'Land updated successfully'));
              
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

const RemoveLand=async(req,res,next)=>{

    const checkUser=await Register.findById(req.user.id);

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Remove Land"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide listed Land id to Remove Land"));
    }
    try {
        const removeLand=await LandModel.findByIdAndDelete(id);

        if (removeLand){
            return next(ApiResponses(200,[],"Land deleted successfully"));
        } else {
            return next(ApiErrors(404,"No Land found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error While Deleting 3PL Warehouse:', error);
        return next(ApiErrors(500,`Internal Server Error, Error -: ${error.message} `));  
    }
}

module.exports={
    AddLand,
    ListerSingleLand,
    AllLandLister,
    UpdateListedLand,
    RemoveLand
}