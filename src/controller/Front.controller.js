const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');

const AllVerified=async(req,res,next)=>{
    try {
         // const warehouse=await Warehouse.find({isVerified:true});
         // const PLWarehouse= await ThreePLWarehouse.find({isVerified:true});
         // const PLColdStorage = await ThreePLColdstorage.find({isVerified:true});
         // if (warehouse.length === 0 && PLWarehouse.length === 0 && PLColdStorage.length === 0) {
         //     return next(ApiErrors(400, `No Warehouse found`));
         // }
         // return next(ApiResponses(200, { warehouse, PLColdStorage, PLWarehouse },'List of All Verified Warehouse'))

        const AllVerified= await Warehouse.aggregate([
            {
                $match:{
                    'isVerified':true,
                },
            },
            {
                $project: 
                    {
                      name: '$basicInfo.name',
                      city: '$basicInfo.city',
                      price: '$floorRent.expectedRent',
                      description: '$warehouseDescription',
                      image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
                      type: '$type',
                    },
            },
            {
                $unionWith:{
                    coll:'threeplwarehouses',
                    pipeline:[
                        {
                            $match:{
                                'isVerified':true,
                            }
                        },
                        {
                            $project: {
                                name: '$company_details.company_name',
                                city: '$warehouse_details.warehouseAddress.city',
                                price: '$warehouse_details.otherDetails.DepositeRent',
                                description: '$warehouse_details.otherDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] }, 
                                type: '$type',
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
                                'isVerified':true,
                            },
                        },
                        {
                            $project: {
                                name: '$company_details.company_name',
                                city: '$cold_storage_details.ColdStorageAddress.city',
                                price: '$cold_storage_details.AdditionDetails.DepositeRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
                                type: '$type',
                              }, 
                        }
                    ]
                }
            }
        ])
        if(AllVerified.length === 0)
        {
            return next(ApiErrors(404,` No Verfied Data found `)); 
        }
        return next(ApiResponses(200,AllVerified,'All Verified Warehouse, 3PL Warehouse and 3PL Cold Storage'))

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
                      description: '$warehouseDescription',
                      image: { $arrayElemAt: ['$wareHouseImage', 0] }, 
                      type: '$type',
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
                                price: '$warehouse_details.otherDetails.DepositeRent',
                                description: '$warehouse_details.otherDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] },
                                type: '$type',
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
                                price: '$cold_storage_details.AdditionDetails.DepositeRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage',0] }, 
                                type: '$type',
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
        // const warehouses=await Warehouse.find({isVerified:true}).sort({ createdAt: -1}).limit(3);
        // const PLWarehouse= await ThreePLWarehouse.find({isVerified:true}).sort({ createdAt: -1}).limit(3);
        // const PLColdStorage = await ThreePLColdstorage.find({isVerified:true}).sort({ createdAt: -1}).limit(3);
        // if(!warehouses || !PLWarehouse || !PLColdStorage)
        // {
        //     return next(ApiErrors(400, `No Warehouse found`)); 
        // }
        // return next(ApiResponses(200, { warehouses, PLColdStorage, PLWarehouse },'List of All Warehouse'))
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
                                price: '$warehouse_details.otherDetails.DepositeRent',
                                description: '$warehouse_details.otherDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$warehouse_details.WarehouseImage', 0] },
                                type: '$type',
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
                                price: '$cold_storage_details.AdditionDetails.DepositeRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
                                type: '$type',
                            }
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
        const { id, state, city, price, type } = req.query;

        const warehouseMatchConditions = {};
        const threePLWarehouseMatchConditions = {};
        const threePLColdstorageMatchConditions = {};      
    
        // if (state) {
        //     warehouseMatchConditions['basicInfo.state'] = state;
        //     threePLWarehouseMatchConditions['warehouse_details.warehouseAddress'] =
        //     {
        //         $elemMatch: { state }
        //     };
        //     threePLColdstorageMatchConditions['cold_storage_details.warehouseAddress'] =
        //     {
        //         $elemMatch: { state }
        //     };
        // }
        if (city) {
            warehouseMatchConditions['basicInfo.city'] = city;
            // if (state) {
            //     // If both state and city are provided
            //     threePLWarehouseMatchConditions['warehouse_details.warehouseAddress'] = {
            //         $elemMatch: { state: state, city: city }
            //     };
            // } else {
                // If only city is provided
                threePLWarehouseMatchConditions['warehouse_details.warehouseAddress'] = {
                    $elemMatch: { city }
                };
                threePLColdstorageMatchConditions['cold_storage_details.warehouseAddress'] =
                {
                    $elemMatch: { city }
                };
            // }
        };
        
        // console.log(warehouseMatchConditions);
        // console.log( threePLWarehouseMatchConditions);
        
        //if (price) {
        //     query['floorRent.expectedRent'] = { $lte: price }; // Assuming price is a maximum value
        // }
        // if (type) {
        //     query['layout.warehouseType'] = type;
        // }

        try 
        {
            // const SingleWarehouse = await Warehouse.find(query);

            const Result= await Warehouse.aggregate([
                {
                    $match : warehouseMatchConditions
                    // {
                    //     'basicInfo.city': req.query.city,
                    //     'basicInfo.state': req.query.state,
                    // },
                },
                {
                    $unionWith:{
                        coll:'threeplwarehouses',
                        pipeline:[
                            { 
                                $match:  threePLWarehouseMatchConditions
                                // {
                                //     'warehouse_details.warehouseAddress': {
                                //         $elemMatch: {city}
                                //     }
                                // }
                            }
                        ]
                    }
                },
                {
                    $unionWith:{
                        coll:'threeplcoldstorages',
                        pipeline:[
                            { 
                                $match:  threePLWarehouseMatchConditions
                                // {
                                //     'warehouse_details.warehouseAddress': {
                                //         $elemMatch: {city}
                                //     }
                                // }
                            }
                        ]
                    }
                }
            ])

            // console.log(Result);
            
            if (Result.length === 0) {
                return next(ApiErrors(404, `No warehouse found matching the criteria`));
            }
    
            return next(ApiResponses(200, Result, 'Warehouse Details'));
        } catch (error) {
            return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));
        }    
}


module.exports={
    AllVerified,
    AllFeatured,
    searchWareHouseAll,
    recentWarehouse
}