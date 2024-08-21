const cloudinary=require('cloudinary').v2;

const fs=require('fs');

cloudinary.config({
    cloud_name:"dm6yqgvm4",
    api_key:"322962655323385",
    api_secret:"_16mqdQ4KPjQ7gd4BMl4Ytrxx0c",
    log_level: "debug" 
});

const uploadOnCloudinary= async (localFilePath,next) => {
    try{
        if(!localFilePath)
        {
            console.log("No file path Provided");
            return null;
        }
        console.log("Uploading file:", localFilePath);
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
            timeout: 60000
        })
        fs.unlinkSync(localFilePath)
        return response;
    }catch (error){
        console.error("Upload error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Ensure file is deleted on error
        }
        return null;
    }
}

module.exports={
    uploadOnCloudinary
}