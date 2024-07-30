
const ApiResponse = (statusCode,data,message)=>{
        // const user=new UserCreate()
        return {
            success:1,
            statusCode,
            message,    
            data,
        }
        // return user
    }


module.exports=ApiResponse