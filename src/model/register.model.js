const mongoose=require('mongoose');
const validator=require('validator');

const registerSchema=new mongoose.Schema(
    {
        role:{
            type:String,
            required: [true,'Role is required'],
            enum:['ADMIN','LISTER']
        },
        password:{
            type:String,
            required:true,
            trim:true,
            // default:"Maniya@2585"
        },
        email:{
            type:String,
            required:[true,'Email is required'],
            trim:true,
            unique:true,
            validate:{
                validator(value){
                    if(!validator.isEmail(value)){
                       throw new Error("Write a Valid Email")
                    }
                }
            },
            default:'null@null.com',
        },
        contactNo:{
            type: String,
            required: [true,'Contact Number is required'],
            trim:true,
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure the phone number is 10 digits long
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Contact number must be a 10-digit number'
            }
        },
        username:{
            type:String,
            required:[true,'Username is required'],
            trim:true,
            default:'null',
        },
        lastname: {
            type:String,
            required:[true,'Lastname is required'],
            trim:true,
            default:'null',
        },
       firstname: {
            type:String,
            required:[true,'Firstname is required'],
            trim:true,
            default:'null',
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