const Warehouse = require('../model/warehouse.model');
const Register=require('../model/register.model');
const mongoose = require('mongoose');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponses=require('../utils/ApiResponse/ApiResponse');
const {uploadOnCloudinary} = require('../middleware/ImageUpload/cloudinaryConfig');

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
                    uploadResult= await uploadOnCloudinary(file.path);
                    link= uploadResult.url;
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

const allWareHouse=async(req,res,next)=>{
    // const {wareHouseID}=req.params;
    try {
        const warehouses=await Warehouse.find();
        if(!warehouses)
        {
            return next(ApiErrors(400, `No Warehouse found`)); 
        }
        return next(ApiResponses(200,warehouses,'List of All Warehouse'))
    } catch (error) {
        return next(ApiErrors(500,`Internal Serve Error, Error -: ${error} `)); 
    }
}

const getWarehouse=async(req,res,next)=>{
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

module.exports={
    AddWareHouse,
    allWareHouse,
    getWarehouse,
    singleWareHouse
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