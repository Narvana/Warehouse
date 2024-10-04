const mongoose=require('mongoose');
const validator=require('validator');

const generateTimestampEmail = () => {
    const timestamp = Date.now(); // Get current timestamp
    return `${timestamp}@null.com`; // Combine timestamp with '@null.com'
};

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
            default:"Maniya@2585"
        },
        email:{
            type:String,
            required:[true,'Email is required'],
            trim:true,
            validate:{
                validator(value){
                    if(!validator.isEmail(value)){
                       throw new Error("Write a Valid Email")
                    }
                }
            },
            default: generateTimestampEmail,
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
        lastname: {
            type:String,
            required:[true,'Lastname is required'],
            trim:true,
            // default:'null',
            unique: true,
        },
       firstname: {
            type:String,
            required:[true,'Firstname is required'],
            trim:true,
            // default:'null',
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