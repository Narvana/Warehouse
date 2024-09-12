const mongoose=require('mongoose');
const validator= require('validator');

const LandSchema= new mongoose.Schema({
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
    type:{ type:String, default:"LAND", immutable: true },
    LandImage:{ 
        type:[String],
        validate:{
            validator: function(v){
                return v && v.length > 0;
            },
            message:'Atleast 1 Land Image is required'
        }
    },
    AdditionalDetails:{
        InterestedIn:[String],
        // {
        //     type:[String],
        //     enum:{
        //         values:['Sale','BTS (Build to Suite)', 'CLU (Conversion of Land Use)', 'Contract Farming', 'Lease'],
        //         message: '{VALUE} is not a valid feild. It must be  Sale,BTS (Build to Suite), CLU (Conversion of Land Use), Contract Farming, Lease',
        //     }
        // },
        SalePrice:{
            type:Number
        },
        ExpectedRent:{
            type:Number,
            required:[true,'Expected Rent is Required']
        },
        SpecialRemark:{
            type:String,
            maxlength:400,
        },
        DYA:{
            type:Boolean,
            required:[true,'Do You Agree Feild is required']
        },
        Road:{
            type:Number,
            required:[true,'Approach Road or Frontage to Land Parcel (Meter) is required for Additional Details'],
            min:0,
        },
    },
    landInfo:{
        FSIAuth:{
            type:Number,
            // required:[true,'FSI'],
            min:0,   
        },
        LandType:{
            type:String,
            required:[true,'Land Type is required for Land Details'],   
        },
        TotalLand:{
            type:Number,
            required:[true,'Total Land Parcel is required for Land Details'],
            min:0,
        },
        Approval:{
            CollectorNOC:{
                type:Boolean,
                default:false
            },
            PanchayatNOC:{
                type:Boolean,
                default:false
            },
            LandUseCertificate:{
                type:Boolean,
                default:false
            },
        },
        Additional:{
            ForestZone:{
                type:Boolean,
                default:false
            },
            SoleOwner:{
                type:Boolean,
                default:false
            },
            IndustrialZone:{
                type:Boolean,
                default:false
            },
            Water:{
                type:Boolean,
                default:false
            },
            Electricity:{
                type:Boolean,
                default:false
            },
            LandIrrigated:{
                type:Boolean,
                default:false
            },
        }
    },

    basicInfo: {
        GoogleCo:{
            type: String,
        },
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
            // required: [true,'Address is required for Basic Information'],
        },
        state: {
            type: String,
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
})

const LandModel = mongoose.model('LandModel',LandSchema);

module.exports = LandModel;