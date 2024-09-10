const Warehouse = require('../model/warehouse.model');
const Enquiry= require("../model/Enquiry.model");
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');

const AllListing=async(req,res,next)=>{
    try {
        const All=await Warehouse.aggregate([
            {
                $project:{
                    name: '$basicInfo.name',
                    city: '$basicInfo.city',
                    price: '$floorRent.expectedRent',
                    description: '$wareHouseDescription',
                    image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
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
                            city: '$warehouse_details.warehouseAddress.city',
                            // state: 
                            price: '$warehouse_details.otherDetails.DepositRent',
                            description: '$warehouse_details.otherDetails.DescribeFacility',
                            image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] }, 
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
                            city: '$cold_storage_details.ColdStorageAddress.city',
                            price: '$cold_storage_details.AdditionDetails.DepositRent',
                            description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                            image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
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
                            city: '$basicInfo.city',
                            price: '$AdditionalDetails.SalePrice',
                            description: '$AdditionalDetails.SpecialRemark',
                            image: { $arrayElemAt: ['$LandImage', 0] },
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
            return next(ApiErrors(400, `No Warehouse found`));
        }
        return next(ApiResponses(200,All,'List of All Warehouse & 3PLWarehouse and 3PLColdStorage'))

    } catch (error) {
        console.error('Internal Server Error:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `)); 
    }
}
 
const AllFeatured=async(req,res,next)=>{
    try {
        const AllFeatured= await Warehouse.aggregate([
            {
                $match:{
                    'isFeatured':true,
                },
            },
            {
                $project: 
                {
                  name: '$basicInfo.name',
                  city: '$basicInfo.city',
                  price: '$floorRent.expectedRent',
                  description: '$wareHouseDescription',
                  image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
                  type: '$type',
                  isVerified : '$isVerified',
                  isFeatured : '$isFeatured',
                  WTRA: '$WTRA'
                },
            },
            {
                $unionWith:{
                    coll:'threeplwarehouses',
                    pipeline:[
                        {
                            $match:{
                                'isFeatured':true,
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
                                isFeatured : '$isFeatured',
                                WTRA: '$WTRA'
                              }, 
                        }
                    ]
                }
            },
            {
                $unionWith:{
                    coll:'threeplcoldstorages',
                    pipeline:[
                        {
                            $match:{
                                'isFeatured':true,
                            },
                        },
                        {
                            $project: {
                                name: '$company_details.company_name',
                                city: '$cold_storage_details.ColdStorageAddress.city',
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
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
                        $match:{
                            'isFeatured':true,
                        },
                    },
                    {
                        $project: {
                            name: '$basicInfo.name',
                            city: '$basicInfo.city',
                            price: '$AdditionalDetails.SalePrice',
                            description: '$AdditionalDetails.SpecialRemark',
                            image: { $arrayElemAt: ['$LandImage', 0] },
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
        if(AllFeatured.length === 0)
        {
            return next(ApiErrors(404,` No Featured Data found `)); 
        }
        return next(ApiResponses(200,AllFeatured,'All Fearured Warehouse, 3PL Warehouse and 3PL Cold Storage'))       
    } catch (error) {
        console.error('Internal Server Error:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `));    
    }
}

// Recent Warehouse API
const recentWarehouse=async(req,res,next)=>{
    try {

        const AllRecent = await Warehouse.aggregate([
            {
                $match: {
                    isVerified: true
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 3
            },
            {
                $project: {
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
            },
            {
                $unionWith: {
                    coll: 'threeplwarehouses',
                    pipeline: [
                        {
                            $match: {
                                isVerified: true
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $limit: 3
                        },
                        {
                            $project: 
                            {
                                name: '$company_details.company_name',
                                city: '$warehouse_details.warehouseAddress.city',
                                price: '$warehouse_details.otherDetails.DepositRent',
                                description: '$warehouse_details.otherDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] },
                                type: '$type',
                                isVerified : '$isVerified',
                                isFeatured : '$isFeatured',
                                WTRA: '$WTRA'
                            }
                        }
                    ]
                }
            },
            {
                $unionWith: {
                    coll: 'threeplcoldstorages',
                    pipeline: [
                        {
                            $match: {
                                isVerified: true
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $limit: 3
                        },
                        {
                            $project: {
                                name: '$company_details.company_name',
                                city: '$cold_storage_details.ColdStorageAddress.city',
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
                                type: '$type',
                                isVerified : '$isVerified',
                                isFeatured : '$isFeatured',
                                WTRA: { $ifNull: ['$WTRA', null] }
                            }
                        }
                    ]
                }
            },
            {
                $unionWith: {
                  coll: 'landmodels', // Correct collection name
                  pipeline: [
                    {
                        $match: {
                            isVerified: true
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $limit: 3
                    },
                    {
                        $project: {
                            name: '$basicInfo.name',
                            city: '$basicInfo.city',
                            price: '$AdditionalDetails.SalePrice',
                            description: '$AdditionalDetails.SpecialRemark',
                            image: { $arrayElemAt: ['$LandImage', 0] },
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: { $ifNull: ['$WTRA', null] }
                        }, 
                    }
                  ]
                }
              }
            
        ]);
        
        // console.log(allData);
        if(AllRecent.length === 0)
        {
            return next(ApiErrors(404,` No Recent Data found `)); 
        }
        return next(ApiResponses(200,AllRecent,'All Recent Warehouse, 3PL Warehouse and 3PL Cold Storage'))  
        
    } catch (error) {
        console.error('Internal Server Error:', error);
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `)); 
    }
}


// Search API
const searchWareHouseAll=async(req,res,next)=>{
    const { city, price, propertytype, type, area, verified } = req.query;

    const warehouseMatchConditions = {};
    const threePLWarehouseMatchConditions = {};
    const threePLColdstorageMatchConditions = {};
    const landConditions = {}; 
    
    // Adding conditions dynamically based on provided parameters
    if (city) {
        warehouseMatchConditions['basicInfo.city'] = city;
        threePLWarehouseMatchConditions['warehouse_details.warehouseAddress.city'] = city;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageAddress.city'] = city;
        landConditions[basicInfo.city] = city;
    }
    
    if (price) {
        const priceCondition = { $lte: parseFloat(price) }; // Less than or equal to the given price
        warehouseMatchConditions['floorRent.expectedRent'] = priceCondition;
        threePLWarehouseMatchConditions['warehouse_details.otherDetails.DepositRent'] = priceCondition;
        threePLColdstorageMatchConditions['cold_storage_details.AdditionDetails.DepositRent'] = priceCondition;
        landConditions[AdditionalDetails.SalePrice] = price;
    }
    
    if (propertytype) {
        warehouseMatchConditions['layout.warehouseType'] = propertytype;
        threePLWarehouseMatchConditions['warehouse_details.Storage.PropertyType'] = propertytype;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.PropertyType'] =propertytype;
    }

    if (area) {
        const selectArea = {$lte:parseFloat(area)}; 
        warehouseMatchConditions['layout.totalPlotArea'] = selectArea;
        threePLWarehouseMatchConditions['warehouse_details.Storage.TotalArea'] = selectArea;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.TotalArea'] = selectArea;
    }

    if (type) {
        warehouseMatchConditions['type'] = type;
        threePLWarehouseMatchConditions['type'] = type;
        threePLColdstorageMatchConditions['type'] =type;
        landConditions['type'] = type;
    }

    if (verified)
    {

        const  verifiedStatus = verified === 'true';

        warehouseMatchConditions['isVerified'] = verifiedStatus;
        threePLWarehouseMatchConditions['isVerified'] = verifiedStatus;
        threePLColdstorageMatchConditions['isVerified'] = verifiedStatus;
        landConditions['isVerified'] = verifiedStatus;
    
    }
    
    try {
        const Result = await Warehouse.aggregate([
            {
                $match: warehouseMatchConditions,
            },
            {
                $project: {
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
            },
            {
                $unionWith: {
                    coll: 'threeplwarehouses',
                    pipeline: [
                        {
                            $match: threePLWarehouseMatchConditions,
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
                                isFeatured : '$isFeatured',
                                WTRA: '$WTRA'
                            }
                        }
                    ]
                }
            },
            {
                $unionWith: {
                    coll: 'threeplcoldstorages',
                    pipeline: [
                        {
                            $match: threePLColdstorageMatchConditions,
                        },
                        {
                            $project: {
                                name: '$company_details.company_name',
                                city: '$cold_storage_details.ColdStorageAddress.city',
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
                                type: '$type',
                                isVerified : '$isVerified',
                                isFeatured : '$isFeatured',
                                WTRA: { $ifNull: ['$WTRA', null] }
                            }
                        }
                    ]
                }
            },
            {
                $unionWith: {
                  coll: 'landmodels', // Correct collection name
                  pipeline: [
                    {
                        $match: landConditions
                    },
                    {
                        $project: {
                            name: '$basicInfo.name',
                            city: '$basicInfo.city',
                            price: '$AdditionalDetails.SalePrice',
                            description: '$AdditionalDetails.SpecialRemark',
                            image: { $arrayElemAt: ['$LandImage', 0] },
                            type: '$type',
                            isVerified : '$isVerified',
                            isFeatured : '$isFeatured',
                            WTRA: { $ifNull: ['$WTRA', null] }
                        }, 
                    }
                  ]
                }
              }
        ]);
    
        if (Result.length === 0) {
            return next(ApiErrors(404, `No warehouse found matching the criteria`));
        }
    
        return next(ApiResponses(200, Result, 'Warehouse Details'));
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));
    }    
}

const SendEnquiry = async(req,res,next)=>{

    const  UserID=req.user.id;

    try {
        const User= await Register.findById(UserID)
        if(!User)
        {
            return next(ApiErrors(404,'No User Found with The ID Provided'));
        }
        const {ListingID,ListingModel} = req.body;
        if(!ListingID || !ListingID.trim() || !ListingModel || !ListingModel.trim())
        {
            return next(ApiErrors(400,'Please Provide Both the feild Listing ID and Listing Model to send Enquiry')); 
        }
        // const modelExists = await Warehouse.exists({ _id: ListingID });
        
        // return res.json(modelExists);

        const enquiry = new Enquiry({
            UserID,
            ListingID,
            ListingModel
        })
        const final = await enquiry.save();
        return next(ApiResponses(200,final,`Enquiry succesfully send by ${req.user.username}`)); 
    } catch (error) {
        return next(ApiErrors(500,`Internal Server Error -: ${error.message}`)); 
    }

}

module.exports={
    // AllVerified,
    AllFeatured,
    searchWareHouseAll,
    recentWarehouse,
    AllListing,
    SendEnquiry,
}

// const AllVerified=async(req,res,next)=>{
//     try {
//         const AllVerified= await Warehouse.aggregate([
//             {
//                 $match:{
//                     'isVerified':true,
//                 },
//             },
//             {
//                 $project: 
//                     {
//                       name: '$basicInfo.name',
//                       city: '$basicInfo.city',
//                       price: '$floorRent.expectedRent',
//                       description: '$wareHouseDescription',
//                       image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
//                       type: '$type',
//                     },
//             },
//             {
//                 $unionWith:{
//                     coll:'threeplwarehouses',
//                     pipeline:[
//                         {
//                             $match:{
//                                 'isVerified':true,
//                             }
//                         },
//                         {
//                             $project: {
//                                 name: '$company_details.company_name',
//                                 city: '$warehouse_details.warehouseAddress.city',
//                                 price: '$warehouse_details.otherDetails.DepositRent',
//                                 description: '$warehouse_details.otherDetails.DescribeFacility',
//                                 image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] }, 
//                                 type: '$type',
//                               }, 
//                         }
//                     ]
//                 }
//             },
//             {
//                 $unionWith:{
//                     coll:'threeplcoldstorages',
//                     pipeline:[
//                         {
//                             $match:{
//                                 'isVerified':true,
//                             },
//                         },
//                         {
//                             $project: {
//                                 name: '$company_details.company_name',
//                                 city: '$cold_storage_details.ColdStorageAddress.city',
//                                 price: '$cold_storage_details.AdditionDetails.DepositRent',
//                                 description: '$cold_storage_details.AdditionDetails.DescribeFacility',
//                                 image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
//                                 type: '$type',
//                               }, 
//                         }
//                     ]
//                 }
//             },
//             {
//                 $unionWith: {
//                   coll: 'landmodels', // Correct collection name
//                   pipeline: [
//                     {
//                         $match:{
//                             'isVerified':true,
//                         },
//                     },
//                     {
//                         $project: {
//                             name: '$basicInfo.name',
//                             city: '$basicInfo.city',
//                             price: '$AdditionalDetails.SalePrice',
//                             description: '$AdditionalDetails.SpecialRemark',
//                             image: { $arrayElemAt: ['$LandImage', 0] },
//                             type: '$type',
//                         }, 
//                     }
//                   ]
//                 }
//               }
//         ])
//         if(AllVerified.length === 0)
//         {
//             return next(ApiErrors(404,` No Verfied Data found `)); 
//         }
//         return next(ApiResponses(200,AllVerified,'All Verified Warehouse, 3PL Warehouse and 3PL Cold Storage'))

//     } catch (error) {
//         console.error('Internal Server Error:', error);
//         return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `)); 
//     }
// }
