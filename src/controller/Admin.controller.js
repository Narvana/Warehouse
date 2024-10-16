const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const LandModel=require('../model/Land.model');
const Log=require('../model/Log.model')
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const { database } = require('firebase-admin');
const Enquiry = require('../model/Enquiry.model');
const Requirement = require('../model/Requirement.model');
const SmallSpace = require('../model/SmallSpace.model');

const UpdateVerifiedStatus=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Change Verified Status"));
    }

    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Listing")); 
    }
    try {
        const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage, LandModel, SmallSpace];

        let data = null;
        let status = null

        for (const model of models) {
            const found = await model.findOne({_id: id});
        
            if (found) {
                status = !found.isVerified; // Corrected field name
        
                data = await model.findByIdAndUpdate(
                    id,
                    {
                        $set:{
                            isVerified: status, // Corrected field name
                            // isFeatured: ((status === false) ? false : found.isFeatured)
                        }
                    },
                    {
                        new: true
                    }
                );
                break;
            }
        }        
        
        // return next(ApiResponses(200,data,'Warehouse is Verified Status Updated'));        
 
        if(data)
        {
            return next(ApiResponses(200,data,`Listing Verified Status Updated to ${status}`));
        }
        return next(ApiErrors(400,"No Listing found with provided id"));         
    } catch (error) {
        return next(ApiErrors(500, `Error : ${error.message}`));
    }
}

const UpdateFeatureStatus=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Change The Featured Status"));
    }

    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Listing")); 
    }
    try {
        const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage,LandModel, SmallSpace];

        let status = null;

        // Iterate through each model to find the document by ID
        for (const model of models) {
            const found = await model.findOne({_id: id});
            
            if (found) {
                status = !found.isFeatured; // Corrected field name
        
                data = await model.findByIdAndUpdate(
                    id,
                    {
                        $set:{
                            isFeatured: status,
                        }
                    },
                    {
                        new: true
                    }
                );
                break;
            }
        }        
        
        if(data)
        {
            return next(ApiResponses(200,data,`Listing Featured Status Updated ${status}`));
        }
        return next(ApiErrors(400,"No Listing found with provided id"));        
    } catch (error) {
    }
}


// All Listing 
const allListing=async(req,res,next)=>{
    try {

        const All=await Warehouse.aggregate([
            {
                $project:{
                    name : '$basicInfo.name',
                    contact : '$basicInfo.contactNo',
                    email : '$basicInfo.email',
                    city: '$basicInfo.city',
                    locality: '$basicInfo.locality',
                    price: '$floorRent.expectedRent',
                    description: '$wareHouseDescription',
                    // image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
                    type: '$type',
                    isVerified : '$isVerified',
                    isFeatured : '$isFeatured',
                    WTRA: '$WTRA'
                },                    
            },
            {
                $unionWith: {
                  coll: 'threeplwarehouses', // Correct collection name
                  pipeline: [
                    {
                        $project: {
                            name: '$company_details.company_name',
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$warehouse_details.warehouseAddress.city',
                            locality : '$warehouse_details.warehouseAddress.area',
                            price: '$warehouse_details.otherDetails.DepositRent',
                            description: '$warehouse_details.otherDetails.DescribeFacility',
                            // image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] }, 
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: '$WTRA'
                        }, 
                    }
                  ] // Empty pipeline to return all documents
                  
                }
              },
              {
                $unionWith: {
                  coll: 'threeplcoldstorages', // Correct collection name
                  pipeline: [
                    {
                        $project: {
                            name: '$company_details.company_name',
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$cold_storage_details.ColdStorageAddress.city',
                            locality: '$cold_storage_details.ColdStorageAddress.area',
                            price: '$cold_storage_details.AdditionDetails.DepositRent',
                            description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                            // image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: { $ifNull: ['$WTRA', null] }
                        }, 
                    }
                  ]
                }
              },
              {
                $unionWith: {
                  coll: 'landmodels', // Correct collection name
                  pipeline: [
                    {
                        $project: {
                            name: '$basicInfo.name',
                            contact: '$basicInfo.contactNo',
                            city: '$basicInfo.city',
                            locality : `$basicInfo.locality`,
                            email : '$basicInfo.email',
                            price: '$AdditionalDetails.SalePrice',
                            description: '$AdditionalDetails.SpecialRemark',
                            // image: { $arrayElemAt: ['$LandImage', 0] },
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: { $ifNull: ['$WTRA', null] }
                        }, 
                    }
                  ]
                }
              },
              {
                $unionWith: {
                  coll: 'smallspaces', // Correct collection name
                  pipeline: [
                    {
                        $project: {
                            name: '$basicInfo.name',
                            contact: '$basicInfo.contactNo',
                            email : '$basicInfo.email',
                            city: '$basicInfo.city',
                            locality : '$basicInfo.locality',
                            price: '$SmallSpaceDetails.expectedRent',
                            description: '$SmallSpaceDescription',
                            // image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: { $ifNull: ['$WTRA', null] }
                        }, 
                    }
                  ]
                }
              }
        ])

         if (All.length===0) {
            return next(ApiErrors(400, `No Listing found`));
        }
        console.log(`Total Listing`,All.length);

        return next(ApiResponses(200,All,'List of All The Listing'))
    } catch (error) {
        console.error('Internal Server Error:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `)); 
    }
}

const EnquiryList = async (req,res,next) =>{

    try {
        const List = await Enquiry.find({ImageEnquiry:false}).populate({
            path: "UserID",
            select: "-_id firstname lastname email contactNo"
        }).lean();
        if(List.length === 0)
        {
            return next(ApiErrors(404,`No Enquiry Found`));    
        }

        for (let enquiry of List) 
        {

            if (enquiry.ListingModel === 'ThreePLWarehouse') {
                await Enquiry.populate(enquiry,{
                    path: "ListingID",
                    select: 'warehouse_details.warehouseAddress.address warehouse_details.warehouseAddress.city warehouse_details.Storage.TotalArea warehouse_details.otherDetails.DepositRent'
                });

                enquiry.ListingID={
                    address : enquiry.ListingID.warehouse_details.warehouseAddress.address ,
                    city : enquiry.ListingID.warehouse_details.warehouseAddress.city,
                    Rent : enquiry.ListingID.warehouse_details.otherDetails.DepositRent,
                    Area : enquiry.ListingID.warehouse_details.Storage.TotalArea,
                }
            }

            else if (enquiry.ListingModel === 'ThreePLColdstorage') {
                await Enquiry.populate(enquiry, {
                    path: "ListingID",
                    select: 'cold_storage_details.ColdStorageAddress.address cold_storage_details.ColdStorageAddress.city cold_storage_details.AdditionDetails.DepositRent cold_storage_details.ColdStorageFacility.TotalArea '
                });
                enquiry.ListingID={
                    address : enquiry.ListingID.cold_storage_details.ColdStorageAddress.address,
                    city : enquiry.ListingID.cold_storage_details.ColdStorageAddress.city,
                    Rent : enquiry.ListingID.cold_storage_details.AdditionDetails.DepositRent,
                    Area : enquiry.ListingID.cold_storage_details.ColdStorageFacility.TotalArea ,
                }
            } else if (enquiry.ListingModel === 'Warehouse') {
                await Enquiry.populate(enquiry, {
                    path: "ListingID",
                    select: 'basicInfo.address basicInfo.city floorRent.expectedRent layout.totalPlotArea'
                });
                
                enquiry.ListingID={
                    address : enquiry.ListingID.basicInfo.address,
                    city : enquiry.ListingID.basicInfo.city,
                    Rent : enquiry.ListingID.floorRent.expectedRent,
                    Area : enquiry.ListingID.layout.totalPlotArea,
                }
            }
            else if (enquiry.ListingModel === 'LandModel') {
                    await Enquiry.populate(enquiry, {
                        path: "ListingID",
                        select: 'basicInfo.address basicInfo.city AdditionalDetails.ExpectedRent landInfo.TotalLand'
                    });            

                    enquiry.ListingID={
                        address : enquiry.ListingID.basicInfo.address,
                        city : enquiry.ListingID.basicInfo.city,
                        Rent : enquiry.ListingID.AdditionalDetails.ExpectedRent,
                        Area : enquiry.ListingID.landInfo.TotalLand,
                    }
            }
            else if (enquiry.ListingModel === 'SmallSpace') {
                await Enquiry.populate(enquiry,{
                    path: "ListingID",
                    select: 'basicInfo.address basicInfo.city SmallSpaceDetails.expectedRent SmallSpaceDetails.totalPlotArea'
                });
                
                enquiry.ListingID={
                    address : enquiry.ListingID.basicInfo.address,
                    city : enquiry.ListingID.basicInfo.city,
                    Rent : enquiry.ListingID.SmallSpaceDetails.expectedRent,
                    Area : enquiry.ListingID.SmallSpaceDetails.totalPlotArea,
                }
            }
        }

        console.log('Total Enquiry List', List.length);

        return next(ApiResponses(200,List,'Enquiry List'));
   
    } catch (error) {
        console.log({error});
        
        return next(ApiErrors(500,`Internal Server Error -: ${error.message}`));        
    }
} 

const ImageEnquiryList = async (req,res,next) =>{

    try {
        const List = await Enquiry.find({ImageEnquiry:true}).populate({
            path: "UserID",
            select: "-_id firstname lastname email contactNo"
        }).lean();
        if(List.length === 0)
        {
            return next(ApiErrors(404,`No Enquiry Found`));    
        }

        for (let enquiry of List) 
        {

            if (enquiry.ListingModel === 'ThreePLWarehouse') {
                await Enquiry.populate(enquiry,{
                    path: "ListingID",
                    select: 'warehouse_details.warehouseAddress.address warehouse_details.warehouseAddress.city warehouse_details.Storage.TotalArea warehouse_details.otherDetails.DepositRent'
                });

                enquiry.ListingID={
                    address : enquiry.ListingID.warehouse_details.warehouseAddress.address ,
                    city : enquiry.ListingID.warehouse_details.warehouseAddress.city,
                    Rent : enquiry.ListingID.warehouse_details.otherDetails.DepositRent,
                    Area : enquiry.ListingID.warehouse_details.Storage.TotalArea,
                }
            }

            else if (enquiry.ListingModel === 'ThreePLColdstorage') {
                await Enquiry.populate(enquiry, {
                    path: "ListingID",
                    select: 'cold_storage_details.ColdStorageAddress.address cold_storage_details.ColdStorageAddress.city cold_storage_details.AdditionDetails.DepositRent cold_storage_details.ColdStorageFacility.TotalArea '
                });
                enquiry.ListingID={
                    address : enquiry.ListingID.cold_storage_details.ColdStorageAddress.address,
                    city : enquiry.ListingID.cold_storage_details.ColdStorageAddress.city,
                    Rent : enquiry.ListingID.cold_storage_details.AdditionDetails.DepositRent,
                    Area : enquiry.ListingID.cold_storage_details.ColdStorageFacility.TotalArea ,
                }
            } else if (enquiry.ListingModel === 'Warehouse') {
                await Enquiry.populate(enquiry, {
                    path: "ListingID",
                    select: 'basicInfo.address basicInfo.city floorRent.expectedRent layout.totalPlotArea'
                });
                
                enquiry.ListingID={
                    address : enquiry.ListingID.basicInfo.address,
                    city : enquiry.ListingID.basicInfo.city,
                    Rent : enquiry.ListingID.floorRent.expectedRent,
                    Area : enquiry.ListingID.layout.totalPlotArea,
                }
            }
            else if (enquiry.ListingModel === 'LandModel') {
                    await Enquiry.populate(enquiry, {
                        path: "ListingID",
                        select: 'basicInfo.address basicInfo.city AdditionalDetails.ExpectedRent landInfo.TotalLand'
                    });            

                    enquiry.ListingID={
                        address : enquiry.ListingID.basicInfo.address,
                        city : enquiry.ListingID.basicInfo.city,
                        Rent : enquiry.ListingID.AdditionalDetails.ExpectedRent,
                        Area : enquiry.ListingID.landInfo.TotalLand,
                    }
            }
            else if (enquiry.ListingModel === 'SmallSpace') {
                await Enquiry.populate(enquiry,{
                    path: "ListingID",
                    select: 'basicInfo.address basicInfo.city SmallSpaceDetails.expectedRent SmallSpaceDetails.totalPlotArea'
                });
                
                enquiry.ListingID={
                    address : enquiry.ListingID.basicInfo.address,
                    city : enquiry.ListingID.basicInfo.city,
                    Rent : enquiry.ListingID.SmallSpaceDetails.expectedRent,
                    Area : enquiry.ListingID.SmallSpaceDetails.totalPlotArea,
                }
            }
        }

        console.log('Total Enquiry List', List.length);

        return next(ApiResponses(200,List,'Enquiry List'));
   
    } catch (error) {
        console.log({error});
        
        return next(ApiErrors(500,`Internal Server Error -: ${error.message}`));        
    }
} 



const ListerList = async(req,res,next) => {

    const Lister = await Register.aggregate([
        {
            $match : {
                    role:'LISTER'
            },
        },
        {
            $lookup: {
                from: 'warehouses', // Collection name for Warehouse
                localField: '_id', // Field in Register
                foreignField: 'Lister', // Field in Warehouse
                as: 'warehouses',
            }
        },
        {
            $lookup: {
                from: 'threeplcoldstorages', // Collection name for ThreePLColdStorage
                localField: '_id',
                foreignField: 'Lister', // Field in ThreePLColdStorage
                as: 'coldStorages',
            }
        },
        {
            $lookup: {
                from: 'threeplwarehouses', // Collection name for ThreePLWarehouse
                localField: '_id',
                foreignField: 'Lister', // Field in ThreePLWarehouse
                as: 'plWarehouses',
            }
        },
        {
            $lookup:{
                from: 'landmodels',
                localField: '_id',
                foreignField: 'Lister',
                as: 'land'
            }
        },
        {
            $lookup:{
                from: 'smallspaces',
                localField: '_id',
                foreignField: 'Lister',
                as: 'Small'
            }
        },
        {
            $project: {
                firstname: 1, // Lister's firstname
                lastname: 1, // Lister's lastname
                email: 1, // Lister's email
                contactNo: 1, // Lister's contact number
                warehouseCount: { $size: '$warehouses' }, // Count of associated warehouses
                coldStorageCount: { $size: '$coldStorages' }, // Count of associated cold storages
                plWarehouseCount: { $size: '$plWarehouses' }, // Count of associated PL warehouses
                landCount: { $size: '$land' },
                smallspaceCount: { $size: '$Small' }
            }
        } 
    ]);

    console.log('Total Listers',Lister.length);
    
    return next(ApiResponses(200,Lister,`Lister's List Detail`));
}

const RequirementList = async(req,res,next)=>{
    const requirement = await Requirement.find();
    // return res.json(requirement.length);
    if(requirement.length > 0)
    {
        console.log('Total Requirement',requirement.length);
        return next(ApiResponses(200, requirement, 'Requirement List'));
    }
    return next(ApiErrors(404, `No requirment List found`)); 

}

const RemoveRequirement= async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Remove Requirement"));
    }

    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Requirement that you want to remove")); 
    } 

    await Requirement.findByIdAndDelete(id)
    .then(() => {
        return next(ApiResponses(200, [], 'Enquiry deleted successfully'));
    })
    .catch((error) => {
        return next(ApiErrors(500, `Error while deleting: ${error.message}`));
    });
}

const RemoveListing = async(req,res,next)=>{
           
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
        return next(ApiErrors(400,"Provide the ID of the Enquiry that you want to remove"));
    }
    const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage, LandModel, SmallSpace];

    try {
        for (const model of models) {
            const found = await model.findOne({ _id: id });
        
            if (found) {

                await model.findByIdAndDelete(id);
    
                await Enquiry.deleteMany({ 
                    ListingID: { $in: id }
                });
    
                return next(ApiResponses(200, [], 'Listing Removed successfully'));
            }
        }
        // If no record was found in any of the models
        return next(ApiErrors(404, 'Listing not found'));
    } catch (error) {
        return next(ApiErrors(500, `Error while deleting: ${error.message}`));
    }
    
    
}

const RemoveEnquiry = async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to Remove Enquiry"));
    }
    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Enquiry that you want to remove")); 
    } 

    await Enquiry.findByIdAndDelete(id)
    .then(() => {
        return next(ApiResponses(200, [], 'Enquiry deleted successfully'));
    })
    .catch((error) => {
        return next(ApiErrors(500, `Error while deleting: ${error.message}`));
    });
}


const RemoveLister = async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});

    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }
    if(req.user.role !== req.role)
    {
        return next(ApiErrors(403,"Access Denied. Only Admin can Change the verified Status"));
    }
    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Enquiry that you want to remove")); 
    } 
    try {
        const findID= await Register.findById(id);
        if(!findID)
        {
            return next(ApiErrors(404,"No User Found with this ID")); 
        }
        const models=[LandModel,Warehouse, ThreePLWarehouse, ThreePLColdstorage,SmallSpace];


        for(const model of models)
        {
            const found= await model.find({Lister:id});


            if(found.length !== 0)
            {               
                let ListingIDs=found.map(listing => listing._id);
                //  return res.json(ListingIDs);
                await Enquiry.deleteMany({ListingID:{$in:ListingIDs}});

                await model.deleteMany({Lister:{$in:id}})
            }
        }

        await Enquiry.deleteMany({UserID:{$in:id}});
        await Register.findByIdAndDelete({id});

    } catch (error) {
         return next(ApiErrors(500, `Error while deleting: ${error.message}`));
    }

}

const GetLog = async(req,res,next)=>{

    const Logs=await Log.aggregate([
        {
            $group: {
                _id: "$SearchedCity",  // Group by the 'SearchedCity' field
                count: { $sum: 1 }     // Count occurrences
            }
        },
        {
            $project: {
                _id: 0,                // Exclude the default _id field
                city: "$_id",          // Rename _id to 'city'
                count: 1               // Keep the count field
            }
        }
     ])

    return next(ApiResponses(200,Logs,`All Logs ${Logs.length}`));
}


module.exports={
   UpdateVerifiedStatus,
   allListing,
   UpdateFeatureStatus,
   EnquiryList,
   ImageEnquiryList,
   ListerList,
   RemoveEnquiry,
   RemoveListing,
   RequirementList,
   RemoveRequirement,
   RemoveLister,
   GetLog
}