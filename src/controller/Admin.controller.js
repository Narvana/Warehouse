const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const { database } = require('firebase-admin');

const UpdateVerifiedStatus=async(req,res,next)=>{
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
        return next(ApiErrors(400,"Provide the ID of the Warehouse/ColdStorage that you want to update")); 
    }
    try {
        const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage];

        let data = null;

        for (const model of models) {
            const found = await model.findOne({_id: id});
        
            if (found) {
                const status = !found.isVerified; // Corrected field name
        
                data = await model.findByIdAndUpdate(
                    id,
                    {
                        $set:{
                            isVerified: status, // Corrected field name
                            isFeatured: ((status === false) ? false : found.isFeatured)
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
            return next(ApiResponses(200,data,'Warehouse is Verified Status Updated'));
        }
        return next(ApiErrors(400,"No Warehouse or cold Storage found with provided id"));         
    } catch (error) {
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
        return next(ApiErrors(401,"Unauthenticaed User. You are not allowed to add products"));
    }
    if(req.user.role !== req.role)
    {
        return next(ApiErrors(403,"Access Denied. Only Admin can Change the verified Status"));
    }
    const id=req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,"Provide the ID of the Warehouse/ColdStorage that you want to update")); 
    }
    try {
        const models = [Warehouse, ThreePLWarehouse, ThreePLColdstorage];

        // Iterate through each model to find the document by ID
        for (const model of models) {
            const found = await model.findOne({_id: id});
            
            if (found) {
                if(found.isVerified === false)
                {
                    return next(ApiErrors(400,"Only Verified Warehouse or 3PL can be featured"));      
                }
                const status = !found.isFeatured; // Corrected field name
        
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
            return next(ApiResponses(200,data,'Warehouse is Verified Status Updated'));
        }
        return next(ApiErrors(400,"No Warehouse or cold Storage found with provided id"));        
    } catch (error) {
    }

}


// All Warehouse + 3PL-Warehouser + 3PL-ColdStorage 
const allWareHouse=async(req,res,next)=>{
    // const {wareHouseID}=req.params;
    try {
        // const warehouse=await Warehouse.find();
        // const PLWarehouse= await ThreePLWarehouse.find();
        // const PLColdStorage = await ThreePLColdstorage.find();
        // if (warehouse.length === 0 && PLWarehouse.length === 0 && PLColdStorage.length === 0) {
        //     return next(ApiErrors(400, `No Warehouse found`));
        // }
        // return next(ApiResponses(200, { warehouse, PLColdStorage, PLWarehouse },'List of All Warehouse'))

        const All=await Warehouse.aggregate([
            {
                $unionWith: {
                  coll: 'threeplwarehouses', // Correct collection name
                  pipeline: [] // Empty pipeline to return all documents
                }
              },
              {
                $unionWith: {
                  coll: 'threeplcoldstorages', // Correct collection name
                  pipeline: [] // Empty pipeline to return all documents
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


module.exports={
   UpdateVerifiedStatus,
   allWareHouse,
   UpdateFeatureStatus
}