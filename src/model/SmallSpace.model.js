const mongoose= require('mongoose');
const validator=require('validator');

const SmallSpaceSchema= new mongoose.Schema({
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
    type:{type:String,default:"SMALLSPACE",immutable: true },
    SmallSpaceImage: {
        type:[String],
        // validate:{
        //     validator: function(v){
        //         return v && v.length > 0;
        //     },
        //     message:'Atleast 1 Image of your Small Space is required'
        // }
     },
     SmallSpaceDescription: {
        type: String,
        required: [true,'Small Space Description is required'],
        // minlength:1,
        // maxlength:300,
    },
    SmallSpaceDetails:{
        expectedDeposit: {
            type: Number,
            required: [true,'Expected Deposit is required for SmallSpace Details'],
        },        
        expectedRent: {
            type: Number,
            required: [true,'Expected Rent is required for SmallSpace Details'],
        },
        totalPlotArea: {
            type: Number,
            min : 10, 
            required: [true,'Total Plot Area is required for Warehouse Layout'],
        },
        features: [String],
        additionalDetails: [String]
    },
    basicInfo: {
        // GoogleCo:{
        //     type: String,
        // },
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

const SmallSpace= mongoose.model('SmallSpace',SmallSpaceSchema);

module.exports = SmallSpace;