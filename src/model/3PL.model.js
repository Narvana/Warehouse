const mongoose=require('mongoose');
const validator=require('validator');

const ContactSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    mobileNo:{
        type: String,
        required: true,
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
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
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

const ThreePLSchema= new mongoose.Schema({
    wareHouseLister:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },

    company_details:
    {
        company_name:{
            type:String,
            required:true,
        },
        GST_no:{
            type: String,
                required: [true, 'GST number is required'],
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
                required: true,
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
                required: true,
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
                required: true,
                unique: true,
                trim:true
            },
            service_type:{
                type:String,
                required:true,
                enum:['COLDSTORAGE','WAREHOUSE','BOTH'],
            }
    },

    warehouse_details:{
        warehouseContact: [ContactSchema],
        warehouseAddress: [AddressSchema],
        features: [String],  
        valueAddedServices: [String], 
        otherDetails: {
            valueAddedService: String,
            MinSpaceCommitment:{type:Number,minlength:0},
            MinTimeDuration:{type:Number,minlength:0},
            DepositExpected:String,
            StandardPallet:{type:Number,minlength:0},
            DescribeFacility:{type:String,maxlength:300}
        },
        Storage:{
            PalletWeight:{type:Number,minlength:0},
            PalletHeight:{type:Number,minlength:0},
            MaxVolPerPallet:{type:Number,minlength:0},
            BusinessHour:{type:String},
            StorageMethod:[String],
            ProductNotAllowed:[String],
            PropertyType:{type:String,enum:['RCC','Industrial Shed']},
            AvaliableArea:{type:Number,minlength:0}
        },
        Financials:{
            StorageCost:{type:Number,minlength:0},
            HandlingCost:{type:Number,minLength:0},
            StorageMGMTCharges:{type:Number,minLength:0},
            HandlingCharges:{type:Number,minLength:0}
        },
        WarehouseImage:[String]
    },

    cold_storage_details:{
        ColdStorageContact: [ContactSchema],
        ColdStorageAddress: [AddressSchema],    
        features: [String],  
        valueAddedServices: [String], 
        AdditionalService: [String],  
        productProfile:[String],
        licenses:[String],
        AdditionDetails:{
            MinSpaceCommitment:{type:Number,minlength:0},
            MinTimeDuration:{type:Number,minlength:0},
            DepositExpected:String,
            StandardPallet:{type:Number,minlength:0},
            DescribeFacility:{type:String,maxlength:300},
            PalletWeight:{type:Number,minlength:0},
            PalletHeight:{type:Number,minlength:0},
            MaxVolPerPallet:{type:Number,minlength:0},
            BusinessHour:{type:String},
            ProductNotAllowed:[String],
        },
        ColdStorageFacility:{
            CoolantType:{type:String,enum:['AMMOINIA','FREON','OTHERS']},
            ContainerMovement:{type:String,enum:['20 Ft','40 Ft']},
            DryArea:{type:Number,minLength:0},
            TotalArea:{type:Number,minLength:0},
            PropertyType:{type:String,enum:['RCC','Industrial Shed']},
            ChamberNo:{type:Number,minLength:0},
            ChamberHeight:{type:Number,minLength:0},
            TotalPalletPosition:{type:Number,minLength:0}, 
            TempRangeMin:{type:Number},
            TempRangeMax:{type:Number,minLength:0},
        },
        BelowZero:{
            PalletPosition:{type:Number,minLength:0},
            StorageCharges:{type:Number,minLength:0},
            HandlingCharges:{type:Number,minLength:0}   
        },
        AboveZero:{
            PalletPosition:{type:Number,minLength:0},
            StorageCharges:{type:Number,minLength:0},
            HandlingCharges:{type:Number,minLength:0}   
        }
    }
});

function isDeepEmpty(obj) {
    return Object.keys(obj).every(key => {
        const value = obj[key];
        if (Array.isArray(value)) {
            return value.length === 0;
        } else if (typeof value === 'object' && value !== null) {
            return isDeepEmpty(value);
        }
        // console.log('Value', !value);        
        return value; // Check for empty string, null, undefined, or false
    });
}


ThreePLSchema.pre('validate', function (next) {
    const serviceType = this.company_details.service_type;

    if (serviceType === 'COLDSTORAGE') {
        if (this.warehouse_details && isDeepEmpty(this.warehouse_details)) {
            console.log('Ware',isDeepEmpty(this.warehouse_details));
            return next(new Error('Warehouse details should not be filled when service_type is COLDSTORAGE'));
        } else {
            this.warehouse_details = undefined;  // Remove the field to prevent it from being saved
        }
    } else if (serviceType === 'WAREHOUSE') {
        if (this.cold_storage_details && isDeepEmpty(this.cold_storage_details)) {
            console.log('Cold',isDeepEmpty(this.cold_storage_details));
            return next(new Error('Cold storage details should not be filled when service_type is WAREHOUSE'));
        } 
        else {
            this.cold_storage_details = undefined;  // Remove the field to prevent it from being saved
        }
    } else if (serviceType === 'BOTH') {
        if (!this.warehouse_details || !isDeepEmpty(this.warehouse_details)) {
            console.log('Ware',isDeepEmpty(this.warehouse_details));
            return next(new Error('Warehouse details must be provided when BOTH service type is selected.'));
        }
        if (!this.cold_storage_details || !isDeepEmpty(this.cold_storage_details)) {
            console.log('Cold',isDeepEmpty(this.cold_storage_details));
            return next(new Error('Cold storage details must be provided when BOTH service type is selected.'));
        }
    }
    next();
});

const ThreePL= mongoose.model('ThreePL',ThreePLSchema);

module.exports = ThreePL;


