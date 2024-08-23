const mongoose=require('mongoose');
const validator=require('validator');

const ContactSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required for Warehouse Contact']
    },
    email:{
        type: String,
        required: [true, 'Email is required for Warehouse Contact'],
        unique: true,
        trim:true
    },
    mobileNo:{
        type: String,
        required: [true, 'Mobile No is required for Warehouse Contact'],
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
    contact_type:{
        type: String,
        enum:['DEFAULT','BUSINESS','SHIPPING'],
    }
})

const AddressSchema= new mongoose.Schema({
    line1:{
        type: String,
    },
    line2:{
        type: String,
    },
    area:{
        type: String,
        required: [true, 'Area is required for Warehouse Address'],
    },
    city:{
        type: String,
        required: [true, 'City is required for Warehouse Address'],
    },
    state:{
        type: String,
        required: [true, 'State is required for Warehouse Address'],
    },
    pincode: {
        type: Number,
        required: [true,'Pincode is required'],
        maxlength:[6,'Pincode number cannot excced 6 digit']
    },
    addressType:{
        type:String,
        enum:['BILLING','BUSINESS','SHIPPING','WAREHOUSE']
    }
})

const ThreePLWarehouseSchema= new mongoose.Schema({
    wareHouseLister:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },

    company_details:
    {
        company_name:{
            type:String,
            required:[true, 'Company Name is required for Company Details']
        },
        GST_no:{
            type: String,
                required: [true, 'GST number is required for Company Details'],
                trim: true,
                maxlength: [15, 'GST number cannot exceed 15 characters'],
                unique: true,
                validate: {
                    validator: function(value) {
                        // Ensure the GST number is alphanumeric and has a length of up to 15 characters
                        return /^[a-zA-Z0-9]{1,15}$/.test(value);
                    },
                    message: 'GST number must be alphanumeric and cannot exceed 15 characters'
                }
        },
        CIN: {
                type: String,
                required: [true, 'Cin is required for Company Details'],
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
            contact_name:{
            type: String,
            required: true,
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
            email:{
                type: String,
                required:  [true, 'Email is required for Contact details'],
                unique: true,
                trim:true
            },
            service_type:{
                type:String,
                default:'WAREHOUSE'
            }
    },

    warehouse_details:{
        warehouseContact: [ContactSchema],
        warehouseAddress: [AddressSchema],
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
        WarehouseImage:[String]
    },
});


const ThreePLWarehouse= mongoose.model('ThreePLWarehouse',ThreePLWarehouseSchema);

module.exports = ThreePLWarehouse;


