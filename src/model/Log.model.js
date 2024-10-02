const mongoose = require('mongoose');
const validator = require('validator');

const Logs = new mongoose.Schema(
    {
        userID : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Register',
        },
        SearchedCity:{
            type:String,
        },
        SearchedLocality:{
            type:String
        }
    }    
)

const Log= mongoose.model('Log',Logs);

module.exports=Log;