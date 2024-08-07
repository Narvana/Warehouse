const cloudinary=require('cloudinary').v2;

const fs=require('fs');

cloudinary.config({
    cloud_name:"dm6yqgvm4",
    api_key:"322962655323385",
    api_secret:"_16mqdQ4KPjQ7gd4BMl4Ytrxx0c"
});

const uploadOnCloudinary= async (localFilePath) => {
    try{
        if(!localFilePath)
        {
            console.log("no file path");
        }
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
    }catch (error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports={
    uploadOnCloudinary
}