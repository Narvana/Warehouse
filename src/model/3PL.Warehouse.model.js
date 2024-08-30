const mongoose=require('mongoose');
const validator=require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const ContactSchema= new mongoose.Schema({
    mobileNo:{
        type: String,
        required: [true, 'Mobile No is required for 3PL Warehouse Contact'],
        unique: true,
        trim:true,
        validate: {
            validator: function(value) {
                // Ensure the phone number is 10 digits long
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Mobile number must be a 10-digit number'
        }
    },
    email:{
        type: String,
        required: [true, 'Email is required for 3PL Warehouse Contact'],
        unique: true,
        trim:true
    },
    name:{
        type: String,
        required: [true, 'Name is required for 3PL Warehouse Contact']
    },
    contact_type:{
        type: String,
        enum: {
            values: ['DEFAULT','BUSINESS','SHIPPING'],
            message: '{VALUE} is not a valid Contact Type. It must be DEFAULT, BUSINESS Or SHIPPING'
        },
    }
})

const AddressSchema= new mongoose.Schema({
    line1:{
        type: String,
    },
    line2:{
        type: String,
    },
    addressType:{
        type:String,
        enum: {
            values: ['BILLING','BUSINESS','SHIPPING','WAREHOUSE'],
            message: '{VALUE} is not a valid Address Type. It must be BILLING, BUSINESS, SHIPPING Or WAREHOUSE'
        },
    },
    pincode: {
        type: Number,
        required: [true,'Pincode is required'],
        minlenth:[6,'Pincode Number cannot be less than 6 digit'],
        maxlength:[6,'Pincode number cannot excced 6 digit']
    },
    state:{
        type: String,
        required: [true, 'State is required for 3PL Warehouse Address'],
    },
    city:{
        type: String,
        required: [true, 'City is required for 3PL Warehouse Address'],
    },
    area:{
        type: String,
        required: [true, 'Area is required for 3PL Warehouse Address'],
    },
})

const ThreePLWarehouseSchema= new mongoose.Schema({
    wareHouseLister:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },

    warehouse_details:{

        features: [String],  
        valueAddedServices: [String], 
        otherDetails: {
            valueAddedService: [String],
            MinSpaceCommitment:{type:Number,min:0},
            MinTimeDuration:{type:Number,min:0},
            DepositExpected:{type:Number,min:0},
            StandardPallet:{type:Number,min:0},
            DescribeFacility:{type:String,maxLength:300}
        },
        Storage:{
            PalletWeight:{type:Number,min:0},
            PalletHeight:{type:Number,min:0},
            MaxVolPerPallet:{type:Number,min:0},
            BusinessHour:{type:String},
            StorageMethod:[String],
            ProductNotAllowed:[String],
            PropertyType:{type:String,enum:['RCC','Industrial Shed']},
            AvaliableArea:{type:Number,min:0}
        },
        Financials:{
            StorageCost:{type:Number,min:0},
            HandlingCost:{type:Number,min:0},
            StorageMGMTCharges:{type:Number,min:0},
            HandlingCharges:{type:Number,min:0}
        },
        WarehouseImage:{ 
            type:[String],
            validate:{
                validator: function(v){
                    return v && v.length > 0;
                },
                message:'Atleast 1 3PL Warehouse Image is required'
            }
        },

        warehouseAddress: {
            type: [AddressSchema],
            validate:{
                validator: function(v){
                    return v && v.length>0
                },
                message:'At least one Warehouse Address is required for Warehouse Details',
            }
        },
        warehouseContact: {
            type:[ContactSchema],
            validate:{
                validator:function(v){
                    return v && v.length>0;
                },
                message:'At least One Warehouse Contact is required for Warehouse Details',
            }
        },

    },
    company_details:
    {
        service_type:{
            type:String,
            default:'WAREHOUSE'
        },
        email:{
            type: String,
            required:  [true, 'Email is required for Contact details'],
            unique: true,
            trim:true
        },
        mobileNo:{
            type: String,
            required: [true, 'Mobile No is required for Contact details'],
            unique: true,
            trim:true,
            validate: {
                validator: function(value) {
                    // Ensure the phone number is 10 digits long
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Mobile number must be a 10-digit number'
            }
        },
        contact_name:{
        type: String,
        required: [true, 'Contact Name is required for Company Details'],
        },
        CIN: {
            type: String,
            required: [true, 'CIN is required for Company Details'],
            trim: true,
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure CIN is a 21-character alphanumeric string
                    return /^[A-Za-z0-9]{21}$/.test(value);
                },
                message: 'CIN must be a 21-character alphanumeric code'
            }
        },
        GST_no:{
            type: String,
                required: [true, 'GST number is required for Company Details'],
                trim: true,
                unique: true,
                validate: {
                    validator: function(value) {
                        // Ensure the GST number is alphanumeric and has a length of up to 15 characters
                        return /^[a-zA-Z0-9]{15}$/.test(value);
                    },
                    message: 'GST number must be alphanumeric and must be 15 characters'
                }
        },    
        company_name:{
            type:String,
            required:[true, 'Company Name is required for Company Details']
        },
    },
},
{
    timestamps:true
}
);

ThreePLWarehouseSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique. The value {VALUE} is already taken.' });

const ThreePLWarehouse= mongoose.model('ThreePLWarehouse',ThreePLWarehouseSchema);

module.exports = ThreePLWarehouse;


