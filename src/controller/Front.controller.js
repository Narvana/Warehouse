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
                      description: '$wareHouseDescription',
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
                                price: '$warehouse_details.otherDetails.DepositRent',
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
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
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
                  description: '$wareHouseDescription',
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
                                price: '$warehouse_details.otherDetails.DepositRent',
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
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
                                description: '$cold_storage_details.AdditionDetails.DescribeFacility',
                                image: { $arrayElemAt: ['$cold_storage_details.ColdStorageImage', 0] },
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
                                price: '$warehouse_details.otherDetails.DepositRent',
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
                                price: '$cold_storage_details.AdditionDetails.DepositRent',
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
    const { city, price, propertytype, type, area } = req.query;

    const warehouseMatchConditions = { isVerified: true };
    const threePLWarehouseMatchConditions = { isVerified: true };
    const threePLColdstorageMatchConditions = { isVerified: true };
    
    // Adding conditions dynamically based on provided parameters
    if (city) {
        warehouseMatchConditions['basicInfo.city'] = city;
        threePLWarehouseMatchConditions['warehouse_details.warehouseAddress.city'] = city;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageAddress.city'] = city;
    }
    
    if (price) {
        const priceCondition = { $lte: parseFloat(price) }; // Less than or equal to the given price
        warehouseMatchConditions['floorRent.expectedRent'] = priceCondition;
        threePLWarehouseMatchConditions['warehouse_details.otherDetails.DepositRent'] = priceCondition;
        threePLColdstorageMatchConditions['cold_storage_details.AdditionDetails.DepositRent'] = priceCondition;
    }
    
    if (propertytype) {
        warehouseMatchConditions['layout.warehouseType'] = propertytype;
        threePLWarehouseMatchConditions['warehouse_details.Storage.PropertyType'] = propertytype;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.PropertyType'] =propertytype;
    }

    if (area) {
        const selectArea = {$lte:area}; 
        warehouseMatchConditions['layout.totalPlotArea'] = selectArea;
        threePLWarehouseMatchConditions['warehouse_details.Storage.TotalArea'] = selectArea;
        threePLColdstorageMatchConditions['cold_storage_details.ColdStorageFacility.TotalArea'] = selectArea;
    }

    if (type) {
        warehouseMatchConditions['type'] = type;
        threePLWarehouseMatchConditions['type'] = type;
        threePLColdstorageMatchConditions['type'] =type;
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
                            }
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


module.exports={
    AllVerified,
    AllFeatured,
    searchWareHouseAll,
    recentWarehouse
}