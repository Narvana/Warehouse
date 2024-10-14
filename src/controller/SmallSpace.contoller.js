const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
const {uploadBase64ToFirebase}= require('../middleware/ImageUpload/firebaseConfig');
const SmallSpace=require('../model/SmallSpace.model');
const Register= require('../model/register.model');

const AddSmallSpace=async(req,res,next)=>{

    const {basicInfo,SmallSpaceDetails,SmallSpaceDescription} = req.body;

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add Small Space"));
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
    
        if(req.files && req.files.SmallSpaceImage && req.files.SmallSpaceImage.length > 0){
            await Promise.all(
                req.files.SmallSpaceImage.map(async (file)=>{
                    
                    uploadResult = await uploadToFirebase(file);
                    link = uploadResult; 
                    imageURL.push(link);
                })
            )
         }
         else{
            imageURL=[];
         }

        
        const smallspace=new SmallSpace({
            Lister:req.user.id,
            isVerified,
            isFeatured:false,
            basicInfo,
            SmallSpaceDetails,
            SmallSpaceDescription,
            SmallSpaceImage: imageURL,
        })
    
        const data=await smallspace.save();

        return next(ApiResponses(201,data,'Small Space Added Successfully')); 

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

const getListerAllSmallSpace=async(req,res,next)=>{
    
    const id=req.user.id;
    
    try {
        const smallspace = await SmallSpace.aggregate([
            {
                $match:{
                    'Lister' :  new mongoose.Types.ObjectId(id) 
                }
            },
            {
                $project : {
                    name: '$basicInfo.name',
                    city: '$basicInfo.city',
                    price: '$SmallSpaceDetails.expectedRent',
                    description: '$SmallSpaceDescription',
                    image: { $ifNull: [{ $arrayElemAt: ['$SmallSpaceImage', 0] }, null] }, 
                    type: '$type',
                    isVerified : '$isVerified',
                    isFeatured : '$isFeatured',
                }
            }
        ]);
    
        if (smallspace.length === 0) {
            return next(ApiErrors(400,`No Small Spaces found with this Lister ID.`));
        }
        return next(ApiResponses(200,smallspace,'Small Space Lists'));
            
    } catch (error) {
        console.log(error);
        return next(ApiErrors(500, `Error while retrieving Small Space: ${error.message}`));   
    }

}

const singleSmallSpace=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide Small Space id to search for Warehouse`)); 
    }
    try {
        const SingleSmallSpace = await SmallSpace.findOne({ _id: id }); 

        if(!SingleSmallSpace)
        {
            return next(ApiErrors(404,`SmallSpace with this id not found`));
        }
        return next(ApiResponses(200,SingleSmallSpace,'SmallSpace Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error while retrieving SmallSpace: ${error.message}`));
    }
}

const updateSmallSpace=async(req,res,next)=>{

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(403,"Unauthenticaed User. You are not allowed to Update this listing"));
    }
    const id= req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide id to update the Small Space"));
    } 
    try {
        const smallspace=await SmallSpace.findById(id);
        if(!smallspace)
        {
            return next(ApiErrors(404,"No Small Space found with this id"));
        }
        const {basicInfo,SmallSpaceDetails,SmallSpaceDescription,base64} = req.body;

        let SmallSpaceImage=[];
        let imageURL=[];
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
            SmallSpaceImage = [...req.body.SmallSpaceImage,...imageURL];            
        }
        else if(req.body.SmallSpaceImage)
        {
            if(req.body.SmallSpaceImage.length > 0)
            {
                SmallSpaceImage = [...req.body.SmallSpaceImage];          
            }
            else
            {
                return next(ApiErrors(400,'Your Small Space Image section is Empty please Upload some Small Space image'));
            }
        }
        else if(!req.body.SmallSpaceImage)
        {
            SmallSpaceImage=smallspace.SmallSpaceImage;
        }
        if(
            Object.keys(basicInfo || {}).length > 0 
            || 
            Object.keys(SmallSpaceDetails || {}).length > 0 
            || 
            Object.keys(SmallSpaceDescription || {}).length > 0 
            || 
            req.body.SmallSpaceImage 
        )
        {   
            if (basicInfo) {
                smallspace.basicInfo = { ...smallspace.basicInfo.toObject(), ...basicInfo };
                // return res.json(basicInfo);
            }

            if (SmallSpaceDetails) {
                smallspace.SmallSpaceDetails = { ...smallspace.SmallSpaceDetails.toObject(), ...SmallSpaceDetails };
            }
    
            if (SmallSpaceDescription) {
                smallspace.SmallSpaceDescription = req.body.SmallSpaceDescription;
            }

            if(SmallSpaceImage)
            {
                smallspace.SmallSpaceImage = [...SmallSpaceImage];
            }

            await smallspace.validate(); 

            const updatedSmallSpace = await SmallSpace.findByIdAndUpdate(
                id,
                {
                    $set: { 
                        ...(basicInfo ? { basicInfo: smallspace.basicInfo } : {}),
                        ...(SmallSpaceDetails ? { SmallSpaceDetails: smallspace ? smallspace.SmallSpaceDetails : SmallSpaceDetails } : {}),
                        ...(SmallSpaceDescription ? { SmallSpaceDescription: smallspace ? smallspace.SmallSpaceDescription : SmallSpaceDescription } : {}),
                        ...(SmallSpaceImage ?  { SmallSpaceImage: smallspace.SmallSpaceImage } : [])
                    },
                },
                {
                    new: true
                    // runValidators: !needsComplexUpdate, // Skip validation if it has already been done
                }
            );

            if (!updatedSmallSpace) {
                return res.status(404).json({ error: 'Small Space Not found'});
              }
              return next(ApiResponses(200,updatedSmallSpace,'Small Space updated successfully'));
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
                console.error('Error updating Small Spaces:', error);
                return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `));
            }    
    }
}

const DeleteSmallSpace=async(req,res,next)=>{

    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Remove Listing"));
    }
    
    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide id to Remove the SmallSpace "));
    }
    try {
        const removeSmallSpace=await SmallSpace.findByIdAndDelete(id);

        if (removeSmallSpace){
            return next(ApiResponses(200,[],"Small Space deleted successfully"));
        } else {
            return next(ApiErrors(404,"No SmallSpace found with the provided ID"));
        }        
    } catch (error) {
        console.error('Error Removing Small Space:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message}`));  
    }   
}

module.exports={
    AddSmallSpace,
    getListerAllSmallSpace,
    singleSmallSpace,
    updateSmallSpace,
    DeleteSmallSpace
}