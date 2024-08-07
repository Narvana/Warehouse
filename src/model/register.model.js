const mongoose=require('mongoose');
const validator=require('validator');

const registerSchema=new mongoose.Schema(
    {
       firstname: {
            type:String,
            required:true,
            trim:true,
        },        
        lastname: {
            type:String,
            required:true,
            trim:true
        },
        username: {
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
        contactNo:{
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure the phone number is 10 digits long
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Contact number must be a 10-digit number'
            }
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            validate:{
                validator(value){
                    if(!validator.isEmail(value)){
                       throw new Error("Write a Valid Email")
                    }
                }
            }
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            required: true,
            enum:['ADMIN','USER','WAREHOUSE']
        },
        refreshToken:
        {
            type:String,
        }
    },
    {
        timestamp:true,
    }
)

const Register=mongoose.model('Register',registerSchema);

module.exports=Register;