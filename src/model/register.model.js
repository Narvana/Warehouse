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
        }
        ,role:{
            type:String,
            required: true,
            enum:['ADMIN','USER','WAREHOUSE']
        }
    },
)

const Register=mongoose.model('Register',registerSchema);

module.exports=Register;