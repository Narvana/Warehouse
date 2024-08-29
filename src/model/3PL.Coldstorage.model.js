const mongoose=require('mongoose');
const validator=require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const ContactSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required for 3PL ColdStorage Contact']
    },
    email:{
        type: String,
        required: [true, 'Email is required for 3PL ColdStorage Contact'],
        unique: true,
        trim:true
    },
    mobileNo:{
        type: String,
        required: [true, 'Mobile No is required for 3PL ColdStorage Contact'],
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
    area:{
        type: String,
        required: [true, 'Area is required for 3PL ColdStorage Address'],
    },
    city:{
        type: String,
        required: [true, 'City is required for 3PL ColdStorage Address'],
    },
    state:{
        type: String,
        required: [true, 'State is required for 3PL ColdStorage Address'],
    },
    pincode: {
        type: Number,
        required: [true,'Pincode is required for 3PL ColdStorage Address'],
        minlength:[6,'Pincode number cannot be less than 6 digit'],
        maxlength:[6,'Pincode number cannot excced 6 digit']
    },
    addressType:{
        type:String,
        enum: {
            values: ['BILLING','BUSINESS','SHIPPING','WAREHOUSE'],
            message: '{VALUE} is not a valid Address Type. It must be BILLING, BUSINESS, SHIPPING Or WAREHOUSE'
        },
    }
})

const ThreePLColdstorageSchema= new mongoose.Schema({
    PLColdStorageLister:{
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
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure the GST number is alphanumeric and has a length of up to 15 characters
                    return /^[a-zA-Z0-9]{15}$/.test(value);
                },
                message: 'GST number must be alphanumeric and must be 15 characters'
            }
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
            default:'COLDSTORAGE'
        }
    },

    cold_storage_details:{
        ColdStorageContact: {
            type:[ContactSchema],
            validate:{
                validator:function(v){
                    return v && v.length>0;
                },
                message:'At least One Cold Storage Contact is required for ColdStorage Details',
            }
        },
        ColdStorageAddress: {
            type: [AddressSchema],
            validate:{
                validator: function(v){
                    return v && v.length>0
                },
                message:'At least one ColdStorage Address is required for ColdStorage Details',
            }
        },        
        features: [String],  
        valueAddedServices: [String], 
        AdditionalService: [String],  
        productProfile:[String],
        licenses:[String],
        AdditionDetails:{
            MinSpaceCommitment:{type:Number,min:0},
            MinTimeDuration:{type:Number,min:0},
            DepositExpected:{type:Number,min:0},
            StandardPallet:{type:Number,min:0},
            DescribeFacility:{type:String,maxLength:300},
            PalletWeight:{type:Number,min:0},
            PalletHeight:{type:Number,min:0},
            MaxVolPerPallet:{type:Number,min:0},
            BusinessHour:{type:String},
            ProductNotAllowed:[String],
        },
        ColdStorageFacility:{
            CoolantType:{type:String,enum:['AMMOINIA','FREON','OTHERS']},
            ContainerMovement:{type:String,enum:['20 Ft','40 Ft']},
            DryArea:{type:Number,min:0},
            TotalArea:{type:Number,min:0},
            PropertyType:{type:String,enum:['RCC','Industrial Shed']},
            ChamberNo:{type:Number,min:0},
            ChamberHeight:{type:Number,min:0},
            TotalPalletPosition:{type:Number,min:0}, 
            TempRangeMin:{type:Number},
            TempRangeMax:{type:Number,min:0},
        },
        BelowZero:{
            PalletPosition:{type:Number,min:0},
            StorageCharges:{type:Number,min:0},
            HandlingCharges:{type:Number,min:0}   
        },
        AboveZero:{
            PalletPosition:{type:Number,min:0},
            StorageCharges:{type:Number,min:0},
            HandlingCharges:{type:Number,min:0}   
        },
        ColdStorageImage: {
            type:[String],
            validate: {
                validator: function(v){
                    return v && v.length > 0;
                },
                message:'Atleast 1 3PL Cold Storage Image is required'
            }
        },
    }
},
{
    timestamps:true
}
);

ThreePLColdstorageSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique. The value {VALUE} is already taken.'});

const ThreePLColdstorage= mongoose.model('ThreePLColdstorage',ThreePLColdstorageSchema);

module.exports = ThreePLColdstorage;
