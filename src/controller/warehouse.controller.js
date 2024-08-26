const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const ThreePL=require('../model/3PL.model');
const ThreePLColdstorage=require('../model/3PL.Coldstorage.model');
const ThreePLWarehouse=require('../model/3PL.Warehouse.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');


// WAREHOUSE CRUD
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
                    
                    uploadResult = await uploadToFirebase(file);
                  
                    link = uploadResult;
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

const getListerWarehouse=async(req,res,next)=>{
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

const singleWareHouse=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide Warehouse id to search for Warehouse`)); 
    }
    try {
        const SingleWarehouse = await Warehouse.findOne({ _id: id }); 

        if(!SingleWarehouse)
        {
            return next(ApiErrors(404,`Warehouse with this id not found`));
        }
        return next(ApiResponses(200,SingleWarehouse,'WareHouse Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving warehouse: ${error}`));
    }
}

const UpdateWarehouse=async(req,res,next)=>{

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
        return next(ApiErrors(403,"Unauthorized User. Only user assign with Warehouse role can access this"));
    }

    const id=req.query.id;

    if(!id)
    {
        return next(ApiErrors(400,"Provide to update the Choosen Warehouse"));
    }
    
    const checkWarehouse=await Warehouse.findOne({_id:id});

}


// 3PL Warehouse CRUD
const Add3PLWarehouse=async(req,res,next)=>{
    const {company_details,warehouse_details}=req.body

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
    if(!company_details || !warehouse_details){
        return next(ApiErrors(400,`All Feilds are required`));
    } 
    try 
    {
        let PL;
        let imageURL = [];
        let uploadResult;
        let link;
        
            if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
                await Promise.all(
                    req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
                        uploadResult = await uploadToFirebase(file);
                        link = uploadResult;
                        imageURL.push(link);
                    })
                );
            } else {
                return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
            }
        
            warehouse_details.WarehouseImage = imageURL;

            PL = new ThreePLWarehouse({
                wareHouseLister: req.user.id,
                company_details,
                warehouse_details,
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

const AllPLWarehouse=async(req,res,next)=>{
    const id=req.user.id;
    // try {
        ThreePLWarehouse.find({ wareHouseLister: new mongoose.Types.ObjectId(id) })
        .populate('wareHouseLister') // Optional: populate the referenced Register data
        .then((warehouse) => {
            if (!warehouse) {
                return next(ApiErrors(400,`No 3PL warehouse found with this wareHouseLister ID.`));
            }
            return next(ApiResponses(200,warehouse,' 3PL WareHouse List'));
        })
        .catch((err) => {
            return next(ApiErrors(500,`Error finding 3PL warehouse: ${err}`));
        });
}

const singlePLWarehouse=async(req,res,next)=>{

    const id = req.query.id;
    if(!id)
    {
        return next(ApiErrors(400,`Provide 3PL Warehouse id to search for 3PL Warehouse`)); 
    }
    try {
        const SinglePLWarehouse = await ThreePLWarehouse.findOne({ _id: id }); 

        if(!SinglePLWarehouse)
        {
            return next(ApiErrors(404,`3PL Warehouse with this id not found`));
        }
        return next(ApiResponses(200,SinglePLWarehouse,'3PL WareHouse Detail'));        
    } catch (error) {
        return next(ApiErrors(500, `Error retrieving 3PL warehouse: ${error}`));
    }
}

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
    // if(!company_details || !cold_storage_details){
    //     return next(ApiErrors(400,`All Feilds are required`));
    // } 
    try 
    {
        let PL;                

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
            if (!coldstorage) {
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

// All Warehouse + 3PL-Warehouser + 3PL-ColdStorage 
const allWareHouse=async(req,res,next)=>{
    // const {wareHouseID}=req.params;
    try {
        const warehouses=await Warehouse.find();
        const PLWarehouse= await ThreePLWarehouse.find();
        const PLColdStorage = await ThreePLColdstorage.find();
        if(!warehouses && !PLWarehouse && !PLColdStorage)
        {
            return next(ApiErrors(400, `No Warehouse found`)); 
        }

        return next(ApiResponses(200, { warehouses, PLColdStorage, PLWarehouse },'List of All Warehouse'))
    } catch (error) {
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `)); 
    }
}

// Search API
const searchWareHouseAll=async(req,res,next)=>{
        const { id, state, city, price, type } = req.query;
    
        // Initialize an empty query object
        let query = {};
    
        // Add filters to the query object based on provided query parameters
        if (id) {
            query._id = id;
        }
        if (state) {
            query['basicInfo.state'] = state;
        }
        if (city) {
            query['basicInfo.city'] = city;
        }
        if (price) {
            query['floorRent.expectedRent'] = { $lte: price }; // Assuming price is a maximum value
        }
        if (type) {
            query['layout.warehouseType'] = type;
        }
    
        try {
            const SingleWarehouse = await Warehouse.find(query);
    
            if (SingleWarehouse.length === 0) {
                return next(ApiErrors(404, `No warehouse found matching the criteria`));
            }
    
            return next(ApiResponses(200, SingleWarehouse, 'Warehouse Details'));
        } catch (error) {
            return next(ApiErrors(500, `Error retrieving warehouse: ${error.message}`));
        }    
}

const Add3PL=async(req,res,next)=>{
    const {company_details,warehouse_details, cold_storage_details}=req.body

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
    // if(!basicInfo || !layout || !floorRent){
    //     return next(ApiErrors(400,`All Feilds are required`));
    // } 
    try 
    {
        let PL;
        let imageURL = [];
        let uploadResult;
        let link;
        
        // if(warehouse_details) {
        //     // Handle warehouse image uploads
        //     if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
        //         await Promise.all(
        //             req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
        //                 uploadResult = await uploadToFirebase(file);
        //                 link = uploadResult;
        //                 imageURL.push(link);
        //             })
        //         );
        //     } else {
        //         return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
        //     }
        
        //     warehouse_details.WarehouseImage = imageURL;
        // }
        
        // if (warehouse_details && cold_storage_details) {
        //     // Both warehouse and cold storage details exist
        //     PL = new ThreePL({
        //         wareHouseLister: req.user.id,
        //         company_details,
        //         warehouse_details,
        //         cold_storage_details,
        //     });
        // } else if (warehouse_details) {
        //     // Only warehouse details exist
        //     PL = new ThreePL({
        //         wareHouseLister: req.user.id,
        //         company_details,
        //         warehouse_details,
        //     });
        // } else if (cold_storage_details) {
        //     // Only cold storage details exist
        //     PL = new ThreePL({
        //         wareHouseLister: req.user.id,
        //         company_details,
        //         cold_storage_details,
        //     });
        // } else {
        //     return next(ApiErrors(400, "No valid details provided."));
        // }

        if(warehouse_details) {
            // Handle warehouse image uploads
            if(req.files && req.files['warehouse_details[WarehouseImage]'] && req.files['warehouse_details[WarehouseImage]'].length > 0) {
                await Promise.all(
                    req.files['warehouse_details[WarehouseImage]'].map(async (file) => {
                        uploadResult = await uploadToFirebase(file);
                        link = uploadResult;
                        imageURL.push(link);
                    })
                );
            } else {
                return next(ApiErrors(400, "No file uploaded. Please upload some pictures"));
            }
        
            warehouse_details.WarehouseImage = imageURL;
        }
        
        if (warehouse_details && cold_storage_details) {
            // Both warehouse and cold storage details exist
            PL = new ThreePL({
                wareHouseLister: req.user.id,
                company_details,
                warehouse_details,
                cold_storage_details,
            });
        } else if (warehouse_details) {
            // Only warehouse details exist
            PL = new ThreePL({
                wareHouseLister: req.user.id,
                company_details,
                warehouse_details,
            });
        } else if (cold_storage_details) {
            // Only cold storage details exist
            PL = new ThreePL({
                wareHouseLister: req.user.id,
                company_details,
                cold_storage_details,
            });
        } else {
            return next(ApiErrors(400, "No valid details provided."));
        }

        
        // Save the PL object
        const data = await PL.save();
 
        return next(ApiResponses(201,data,'3PL Added Successfully'));

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

module.exports={
    AddWareHouse,
    allWareHouse,
    getListerWarehouse,
    singleWareHouse,
    searchWareHouseAll,
    Add3PL,
    Add3PLWarehouse,
    AllPLWarehouse,
    singlePLWarehouse,
    Add3PLColdStorage,
    AllPLColdStorage,
    singlePLColdStorage
}

// {
//     "basicInfo": {
//         "name": "ABCD",
//         "contactNo": "2234567892",
//         "email": "abcdefh@gmail.com",
//         "ownerShipType": "Owner",
//         "locality": "Industrial Area",
//         "city": "CityName",
//         "state": "StateName",
//         "address": "123 Lane",
//         "pincode": 1234567
//     },
//     "layout": {
//         "warehouseType": "RCC",
//         "buildUpArea": 5000,
//         "totalPlotArea": 10000,
//         "totalParkingArea": 2000,
//         "plotStatus": "Industrial",
//         "listingFor": "Selling",
//         "plinthHeight": 5,
//         "door": 10,
//         "electricity": 400,
//         "additionalDetails": [
//             "Toilet",
//             "Close to highway",
//             "24/7 security"
//         ]
//     },
//     "floorRent": {
//         "floors": [
//             {
//                 "floor": "Ground",
//                 "area": 2500,
//                 "height": 29,
//                 "length": 50,
//                 "breadth": 50,
//                 "_id": "66b338cb3b673a52ad57946b"
//             },
//             {
//                 "floor": "First",
//                 "area": 2500,
//                 "height": 20,
//                 "length": 50,
//                 "breadth": 50,
//                 "_id": "66b338cb3b673a52ad57946c"
//             }
//         ],
//         "warehouseDirection": "NorthEast",
//         "roadAccess": "Main Road Access",
//         "expectedRent": 10000,
//         "expectedDeposit": 10000,
//         "warehouseDescription": "Spacious warehouse with ample parking"
//     },
//     "_id": "66b338cb3b673a52ad57946a",
//     "wareHouseLister": {
//         "_id": "66b33763cea6a137d4d3ffff",
//         "firstname": "Nitin",
//         "lastname": "Singh",
//         "username": "Nitin",
//         "contactNo": "2234567890",
//         "email": "Nitinn3@gmail.com",
//         "password": "$2a$10$jZyLQHY9gPm3GZ.dd06VPu0gzjKpiQaspn/diER9h0uQZH.PMNwY2",
//         "role": "WAREHOUSE",
//         "__v": 0,
//         "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjMzNzYzY2VhNmExMzdkNGQzZmZmZiIsInJvbGUiOiJXQVJFSE9VU0UiLCJpYXQiOjE3MjMwMjEyMTcsImV4cCI6MTcyMzg4NTIxN30.mf7w8BlmjgFUf8Cj4FPMJKHMl12xlohUyEcxNiEZpAI"
//     },
//     "wareHouseImage": [
//         "http://res.cloudinary.com/dm6yqgvm4/image/upload/v1723021514/mf7aogwlnnpdekxkxybl.jpg",
//         "http://res.cloudinary.com/dm6yqgvm4/image/upload/v1723021515/aph03pd6bntsbobcgrai.jpg"
//     ],
//     "__v": 0
// }