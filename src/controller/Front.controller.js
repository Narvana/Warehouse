const Warehouse = require('../model/warehouse.model');
const Enquiry= require("../model/Enquiry.model");
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const Log=require('../model/Log.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const Requirement = require('../model/Requirement.model');
const LandModel = require('../model/Land.model');
const SmallSpace = require('../model/SmallSpace.model');
const ApiResponse = require('../utils/ApiResponse/ApiResponse');

const AllListing=async(req,res,next)=>{
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
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$warehouse_details.warehouseAddress.city',
                            locality : '$warehouse_details.warehouseAddress.area',
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
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$cold_storage_details.ColdStorageAddress.city',
                            locality: '$cold_storage_details.ColdStorageAddress.area',
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
                            contact: '$basicInfo.contactNo',
                            city: '$basicInfo.city',
                            locality : `$basicInfo.locality`,
                            email : '$basicInfo.email',
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
                            image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
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
        console.log('Total Listings', All.length);        
        return next(ApiResponses(200,All,'List of All Listing'));
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
                    name : '$basicInfo.name',
                    contact : '$basicInfo.contactNo',
                    email : '$basicInfo.email',
                    city: '$basicInfo.city',
                    locality: '$basicInfo.locality',
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
                                contact : '$company_details.mobileNo',
                                email : '$company_details.email',
                                city: '$warehouse_details.warehouseAddress.city',
                                locality : '$warehouse_details.warehouseAddress.area',
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
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$cold_storage_details.ColdStorageAddress.city',
                            locality: '$cold_storage_details.ColdStorageAddress.area',
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
                            contact: '$basicInfo.contactNo',
                            city: '$basicInfo.city',
                            locality : `$basicInfo.locality`,
                            email : '$basicInfo.email',
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
            },
            {
                $unionWith: {
                  coll: 'smallspaces', // Correct collection name
                  pipeline: [
                    {
                        $match:{
                            'isFeatured':true,
                        },
                    },
                    {
                        $project: {
                            name: '$basicInfo.name',
                            contact: '$basicInfo.contactNo',
                            email : '$basicInfo.email',
                            city: '$basicInfo.city',
                            locality : '$basicInfo.locality',
                            price: '$SmallSpaceDetails.expectedRent',
                            description: '$SmallSpaceDescription',
                            image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
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
        return next(ApiResponses(200,AllFeatured,'All Fearured Listing'));       
    } catch (error) {

        console.error('Internal Server Error:', error);

        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error.message} `));    
    }
}

// Recent Warehouse API
const recentWarehouse=async(req,res,next)=>{
    try {

        const AllRecent = await Warehouse.aggregate([
            // {
            //     $match: {
            //         isVerified: true
            //     }
            // },
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
                    name : '$basicInfo.name',
                    contact : '$basicInfo.contactNo',
                    email : '$basicInfo.email',
                    city: '$basicInfo.city',
                    locality: '$basicInfo.locality',
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
                        // {
                        //     $match: {
                        //         isVerified: true
                        //     }
                        // },
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
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$warehouse_details.warehouseAddress.city',
                            locality : '$warehouse_details.warehouseAddress.area',
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
                        // {
                        //     $match: {
                        //         isVerified: true
                        //     }
                        // },
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
                    // {
                    //     $match: {
                    //         isVerified: true
                    //     }
                    // },
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
                            contact: '$basicInfo.contactNo',
                            city: '$basicInfo.city',
                            locality : `$basicInfo.locality`,
                            email : '$basicInfo.email',
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
            },
            {
                $unionWith: {
                  coll: 'smallspaces', // Correct collection name
                  pipeline: [
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
                            contact: '$basicInfo.contactNo',
                            email : '$basicInfo.email',
                            city: '$basicInfo.city',
                            locality : '$basicInfo.locality',
                            price: '$SmallSpaceDetails.expectedRent',
                            description: '$SmallSpaceDescription',
                            image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
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
const searchWareHouseAll=async(req,res,next)=>
{
    const { city, price, propertytype, type, area, verified, locality } = req.query;

    const warehouseMatchConditions = {};
    const threePLWarehouseMatchConditions = {};
    const threePLColdstorageMatchConditions = {};
    const landConditions = {};
    const smallspace = {};
    
    if (locality && !city) {
        return next(ApiErrors(400, "Please provide a city when searching by locality."));
    }
    
    if (city) {
        warehouseMatchConditions['basicInfo.city'] = city;
        threePLWarehouseMatchConditions['warehouse_details.warehouseAddress.city'] = city;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageAddress.city'] = city;
        landConditions['basicInfo.city'] = city;
        smallspace['basicInfo.city'] = city;
    }
    
    if(locality && city){
        warehouseMatchConditions['basicInfo.locality'] = locality;
        threePLWarehouseMatchConditions['warehouse_details.warehouseAddress.area'] = locality;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageAddress.area'] = locality;
        landConditions['basicInfo.locality'] = locality;
        smallspace['basicInfo.locality'] = locality;
    }
    
    if (price) {
        const priceCondition = { $lte: parseFloat(price) };
        warehouseMatchConditions['floorRent.expectedRent'] = priceCondition;
        threePLWarehouseMatchConditions['warehouse_details.otherDetails.DepositRent'] = priceCondition;
        threePLColdstorageMatchConditions['cold_storage_details.AdditionDetails.DepositRent'] = priceCondition;
        landConditions['AdditionalDetails.SalePrice'] = price;
        smallspace['SmallSpaceDetails.expectedRent'] = city;
    }
    
    if (propertytype) {
        warehouseMatchConditions['layout.warehouseType'] = propertytype;
        threePLWarehouseMatchConditions['warehouse_details.Storage.PropertyType'] = propertytype;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.PropertyType'] = propertytype;
    }
    
    if (area) {
        const selectArea = {$lte: parseFloat(area)};
        warehouseMatchConditions['layout.totalPlotArea'] = selectArea;
        threePLWarehouseMatchConditions['warehouse_details.Storage.TotalArea'] = selectArea;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.TotalArea'] = selectArea;
        smallspace['SmallSpaceDetails.totalPlotArea'] = city;
    }
    
    if (type) {
        warehouseMatchConditions['type'] = type;
        threePLWarehouseMatchConditions['type'] = type;
        threePLColdstorageMatchConditions['type'] = type;
        landConditions['type'] = type;
        smallspace['type'] = type;
    }
    
    if (verified) {
        const verifiedStatus = verified === 'true';
        warehouseMatchConditions['isVerified'] = verifiedStatus;
        threePLWarehouseMatchConditions['isVerified'] = verifiedStatus;
        threePLColdstorageMatchConditions['isVerified'] = verifiedStatus;
        landConditions['isVerified'] = verifiedStatus;
        smallspace['isVerified'] = verifiedStatus;
    }

    try 
    {
        Result = await Warehouse.aggregate([
            {
                $match: warehouseMatchConditions,
            },
            {
                $project: {
                    name : '$basicInfo.name',
                    contact : '$basicInfo.contactNo',
                    email : '$basicInfo.email',
                    city: '$basicInfo.city',
                    locality: '$basicInfo.locality',
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
                            contact : '$company_details.mobileNo',
                            email : '$company_details.email',
                            city: '$warehouse_details.warehouseAddress.city',
                            locality : '$warehouse_details.warehouseAddress.area',
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
                                contact : '$company_details.mobileNo',
                                email : '$company_details.email',
                                city: '$cold_storage_details.ColdStorageAddress.city',
                                locality: '$cold_storage_details.ColdStorageAddress.area',
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
                            contact: '$basicInfo.contactNo',
                            city: '$basicInfo.city',
                            locality : `$basicInfo.locality`,
                            email : '$basicInfo.email',
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
            },
            {
                $unionWith: {
                  coll: 'smallspaces', // Correct collection name
                  pipeline: [
                    {
                        $match: smallspace
                    },
                    {
                        $project: {
                           name: '$basicInfo.name',
                            contact: '$basicInfo.contactNo',
                            email : '$basicInfo.email',
                            city: '$basicInfo.city',
                            locality : '$basicInfo.locality',
                            price: '$SmallSpaceDetails.expectedRent',
                            description: '$SmallSpaceDescription',
                            image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
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

        let message=null;
        if (Result.length === 0 && locality && city) 
        {
            delete warehouseMatchConditions['basicInfo.locality'];
            delete threePLWarehouseMatchConditions['warehouse_details.warehouseAddress.area'];
            delete threePLColdstorageMatchConditions['cold_storage_details.ColdStorageAddress.area'];
            delete landConditions['basicInfo.locality'];
            delete smallspace['basicInfo.locality'];

            Result = await Warehouse.aggregate([
                {
                    $match: warehouseMatchConditions,
                },
                {
                    $project: {
                        name : '$basicInfo.name',
                        contact : '$basicInfo.contactNo',
                        email : '$basicInfo.email',
                        city: '$basicInfo.city',
                        locality: '$basicInfo.locality',
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
                                    contact : '$company_details.mobileNo',
                                    email : '$company_details.email',
                                    city: '$warehouse_details.warehouseAddress.city',
                                    locality : '$warehouse_details.warehouseAddress.area',
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
                                    contact : '$company_details.mobileNo',
                                    email : '$company_details.email',
                                    city: '$cold_storage_details.ColdStorageAddress.city',
                                    locality: '$cold_storage_details.ColdStorageAddress.area',
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
                                contact: '$basicInfo.contactNo',
                                city: '$basicInfo.city',
                                locality : `$basicInfo.locality`,
                                email : '$basicInfo.email',
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
                },
                {
                    $unionWith: {
                    coll: 'smallspaces', // Correct collection name
                    pipeline: [
                        {
                            $match: smallspace
                        },
                        {
                            $project: {
                            name: '$basicInfo.name',
                                contact: '$basicInfo.contactNo',
                                email : '$basicInfo.email',
                                city: '$basicInfo.city',
                                locality : '$basicInfo.locality',
                                price: '$SmallSpaceDetails.expectedRent',
                                description: '$SmallSpaceDescription',
                                image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
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

            message = 'No Listing Found in selected locality';
        }

        if (Result.length === 0) {
            return next(ApiErrors(404, `No warehouse found matching the criteria`));
        }
        return next(ApiResponses(200, Result, message ? message : 'Searched Listings'));
    } catch (error) {
        console.log({error});        
        return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));
    }    
}

const AllSmallSpace = async(req,res,next)=>{
    const smallSpace = await SmallSpace.aggregate([
       {
            $project: {
                name: '$basicInfo.name',
                contact: '$basicInfo.contactNo',
                email : '$basicInfo.email',
                city: '$basicInfo.city',
                locality : '$basicInfo.locality',
                price: '$SmallSpaceDetails.expectedRent',
                description: '$SmallSpaceDescription',
                image: { $arrayElemAt: ['$SmallSpaceImage', 0] },
                type: '$type',
                isVerified : '$isVerified',
                isFeatured : '$isFeatured',
                WTRA: { $ifNull: ['$WTRA', null] }
            }
       } 
    ]);

    if(smallSpace.length === 0)
    {
        return next(ApiResponse(200,smallSpace,'Currently No Small Space Present'));
    }

    return next(ApiResponse(200,smallSpace,`Total Small Spaces Present -: ${smallSpace.length}`));
}
 
const SendEnquiry = async(req,res,next)=>{

    const  UserID=req.user.id;

    try 
    {
        const User= await Register.findById(UserID)
        if(!User)
        {
            return next(ApiErrors(404,'No User Found with The ID Provided'));
        }
        const { UserName , ListingID , ListingModel, EnquiryMessage } = req.body;
        if(!ListingID || !ListingID.trim() || !ListingModel || !ListingModel.trim())
        {
            return next(ApiErrors(400,'Please Provide Both the field Listing ID and Listing Model to send Enquiry')); 
        }
        const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage,LandModel,SmallSpace];

        let found=null;

        for (const model of models) {
             found = await model.findOne({_id: ListingID});
            if (found) {
                break;
            }
        }       

        if(!found)
        {
            return next(ApiErrors(400,'No Listing found with the provided Listing ID')); 
        }


        if(found.Lister == UserID)
        {            
            return next(ApiErrors(400,'You Can Not enquire for your own Listing')); 
        }

        const EnquiryExist = await Enquiry.findOne({
            UserID,
            ListingID
        });
        if(EnquiryExist)
        {
            return next(ApiErrors(400,'You have already Enquired for this Listing')); 
        }

        const enquiry = new Enquiry({
            UserName,
            UserID,
            ListingID,
            ListingModel,
            EnquiryMessage
        })

        const final = await enquiry.save();
        return next(ApiResponses(200,final,`Enquiry succesfully send by ${req.user.username}`)); 
    } catch (error) {
        return next(ApiErrors(500,`Internal Server Error -: ${error.message}`)); 
    }
}

const SendRequirement=async(req,res,next)=>{

    const { lookingFor, name, email, mobileNo, company_name, describe } = req.body;

    try {
        const requirement = new Requirement({
            lookingFor,
            name,
            email,
            mobileNo,
            company_name,
            describe
        });
    
        await requirement.save(); // Save the requirement to the database
        return next(ApiResponses(200, requirement, 'Requirement saved successfully'));
    } catch (error) {
        if(error.name === 'ValidationError')
            {
                const errorMessages = Object.values(error.errors).map(error => error.message);
                console.log({ ERROR : error });
                return next(ApiErrors(500,errorMessages[0]));            
            }
        return next(ApiErrors(500, `Error while saving requirement: ${error.message}`));
    }  
}

const AddLog=async(req,res,next)=>{
    
    const {user}=req.query;

    const checkUser = await Register.findOne({_id:user});

    // return res.json(checkUser);

    let userID=null;

    // if(checkUser)
    // {
    //     userID=checkUser._id;
    // }

    const {SearchedCity,SearchedLocality} = req.body;

    const log = new Log({
        userID: checkUser ? checkUser._id : null,
        SearchedCity,
        SearchedLocality
    })

    const addedlog = await log.save();
    return next(ApiResponse(200,addedlog,'Log Added'));
}





module.exports={
    // AllVerified,
    AllFeatured,
    AllSmallSpace,
    searchWareHouseAll,
    recentWarehouse,
    AllListing,
    SendEnquiry,
    SendRequirement,
    AddLog,
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
