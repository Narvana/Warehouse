const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const statesAndUTs = [ "Andhra Pradesh", "Arunachal Pradesh", "Assam",
    "Bihar",
    "Chandigarh (UT)",
    "Chhattisgarh",
    "Dadra and Nagar Haveli (UT)",
    "Daman and Diu (UT)",
    "Delhi (NCT)",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Lakshadweep (UT)",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry (UT)",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal"
];

const floorSchema = new mongoose.Schema({
    breadth: {
        type: Number,   
        required: [true, 'Floor breadth is required for Warehouse FloorRent'],
    },
    length: {
        type: Number,   
        required: [true, 'Floor length is required for Warehouse FloorRent'],
    },
    height: {
        type: Number,   
        required: [true, 'Floor height is required for Warehouse FloorRent'],
    },
    area: {
        type: Number, // Correct type for numeric values
        required: [true, 'Floor Area is required for Warehouse FloorRent'],
    },
    floor: {
        type: String,
        required: [true, 'Specifing Floor type is required for Warehouse FloorRent'],
        // enum: {
        //     values: ['Basement', 'Ground', 'First', 'Second'],
        //     message: '{VALUE} is not a valid Floor Type. It must be Basement, Ground, First Or Second'
        // },
    },
});

const warehouseSchema = new mongoose.Schema({
    Lister:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isFeatured:{
        type:Boolean,
        default:false 
    },
    type:{type:String,default:"WAREHOUSE",immutable: true },
    wareHouseImage: {
        type:[String],
        validate:{
            validator: function(v){
                return v && v.length > 0;
            },
            message:'Atleast 1 Warehouse Image is required'
        }
     },
     wareHouseDescription: {
        type: String,
        required: [true,'WareHouse Description is required'],
        // minlength:1,
        // maxlength:300,
    },
    WTRA:{
        type:Boolean,
        default:false
        // required:[true, 'WTRA Norms Feild is Required'],
    },
    floorRent: {
        // floors: [floorSchema], // Use correct array notation
        expectedDeposit: {
            type: Number,
            required: [true,'Expected Deposit is required for Warehouse FloorRent'],
        },        
        expectedRent: {
            type: Number,
            required: [true,'Expected Rent is required for Warehouse FloorRent'],
        },
        roadAccess: {
            type: String,
            required: [true,'Road Access is required for Warehouse FloorRent'],
        }, 
        warehouseDirection: {
            type: String,
            required: [true,'WareHouse Direction is required for Warehouse FloorRent'],
            enum: ['North', 'South', 'East', 'West', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest']
        },
        floors: {
            type: [floorSchema],
            validate: {
                validator: function (v) {
                    return v && v.length > 0; // Ensure array is not empty
                },
                message: 'At least One Floor Information is required for Warehouse FloorRent',
            },
            required: [true, 'Floors are required for Warehouse FloorRent'],
        }, 

    },
    layout: {
        additionalDetails: [String], // Array of strings for additional details
        electricity: {
            type: Number,
            required: [true,'Electricity is required for Warehouse Layout'],
        },
        door: {
            type: Number,
            required: [true,'Doors is required for Warehouse Layout'],
        },
        plinthHeight: {
            type: Number,   
            required: [true,'Plinth Height is required for Warehouse Layout'],
        },
        listingFor: {
            type: String,
            enum: 
            {
                values: ['Rent', 'Selling'],
                message: '{VALUE} is not a valid Listing type. It must be either Rent or Selling.'
            },
            required: [true,'Listing for is required for Warehouse Layout'],
        },
        plotStatus: {
            type: String,
            enum:
            {
                values: ['Agriculture', 'Commercial', 'Industrial', 'Residential'],
                message: '{VALUE} is not a valid Plot Status. It must be either Agriculture, Commercial, Industrial or Residential.'
            },
            required: [true,'Plot Status is required for Warehouse Layout'],
        },
        totalParkingArea: {
            type: Number,
            required: [true,'Total Parking Area is required for Warehouse Layout'],
        },
        totalPlotArea: {
            type: Number,
            required: [true,'Total Plot Area is required for Warehouse Layout'],
        },
        buildUpArea: {
            type: Number,
            required: [true,'Build Up Area is required for Warehouse Layout'],
        },
        warehouseType: {
            type: String,
            enum: 
            {
                values: ['RCC', 'Industrial Shed'],
                message: '{VALUE} is not a valid Warehouse Type. It must be either RCC Or Industrial Shed'
            },
            required: [true,'Warehouse Type is required for Warehouse Layout'],
        },

    },
    basicInfo: {
        pincode: 
        {
            type: Number,
            required: [true, 'Pincode is required for Basic Information'],
            validate: 
            {
                validator: function(v) {
                    return /^[0-9]{6}$/.test(v);
                },
                message: `Pincode must be a 6-digit pincode!`
            }
        }, 
        address: {
            type: String,
            required: [true,'Address is required for Basic Information'],
        },
        state: {
            type: String,
            // enum: {
            // values: statesAndUTs,
            // message: '{VALUE} is not a valid state or union territory in India.'
            // },
            required: [true,'State is required for Basic Information'],
        },
        city: {
            type: String,
            required: [true,'City is required for Basic Information'],
        },
        locality: {
            type: String,
            required: [true,'Locality is required for Basic Information'],
        },
        ownerShipType: {
            type: String,
            enum: {
                values: ['Broker', 'Owner'],
                message: '{VALUE} is not a valid Owner Ship Type. It must be Broker Or Owner'
            },
            required: [true,'Choose a Owner Ship Type for Basic Information'],
        },
        email: {
            type: String,
            required: [true,'Email is required for Basic Information'],
            unique: true,            
            trim: true,
            validate: {
                validator(value) {
                    return validator.isEmail(value);
                },
                message: 'Write a Valid Email'
            }
        },
        contactNo: {
            type: String,
            required: [true,'Contact Number is required for Basic Information'],
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure the phone number is 10 digits long
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Contact number must be a 10-digit number for Basic Information'
            }
        },
        name: {
            type: String,
            required: [true, 'Your good name is required for Basic Information']
        },
    },

},
{
    timestamps:true
});

// warehouseSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique. The value {VALUE} is already taken.' });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;



