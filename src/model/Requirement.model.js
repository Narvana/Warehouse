const mongoose=require('mongoose');
const validator=require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const RequirementSchema = new mongoose.Schema({
     lookingFor:{
        type:[String],
        validate: {
            validator:function (value)
            {
                return value && value.length > 0
            },
            message:'Select Atleast 1 Looking For feild'
        }
    },
     name:{
        type: String,
     }, 
     email:{
        type:String,
        required:true,
        trim:true,
        validate:{
            validator(value){
                if(!validator.isEmail(value)){
                   throw new Error("Write a Valid Email")
                }
            }
        }
    },
    mobileNo:{
        type: String,
        trim:true,
        required:true,
        validate: {
            validator: function(value) {
                // Ensure the phone number is 10 digits long
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Mobile number must be a 10-digit number'
        }
    },
    company_name:{
        type:String
    },
    describe:{
        type:String,
        minlength:0,
        maxlength:500
    }
}) 

const Requirement = mongoose.model("Requirement",RequirementSchema);

module.exports= Requirement