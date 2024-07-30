
const ApiErrors = (statusCode,message)=>{
    
    return {
        success:0,
        statusCode,
        message,    
    }
}

module.exports=ApiErrors
