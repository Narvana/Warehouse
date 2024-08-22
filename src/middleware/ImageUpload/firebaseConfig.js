const admin = require('firebase-admin');

var serviceAccount = require("../../WarehouseServiceAccountKey.json"); // Assuming correct path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   storage: "gs://warehouse-d797d.appspot.com"
 storageBucket: "gs://warehouse-d797d.appspot.com"
});


const uploadToFirebase = async (file) => {
    try {
        // return res.json(file);
      const bucket = admin.storage().bucket(); // Reference to the storage bucket
      const fileRef = bucket.file(file.originalname); // Create a reference to the uploaded file in storage
      const fileStream = fileRef.createWriteStream({
        metadata: {
          contentType: file.mimetype // Set the correct MIME type
        }
      });
  
      return new Promise((resolve, reject) => 
        {
            fileStream.on('error', (error) => {
            console.error('Error uploading file:', error);
            reject(error);
            });
    
            fileStream.on('finish', async () => {
            try {
                const downloadURL = await fileRef.getSignedUrl({
                action: 'read',
                expires: '01-01-2500' // Set expiration date as desired
                });
                console.log('File uploaded successfully:', downloadURL);
                resolve(downloadURL[0]); // Resolve with the first download URL
            } catch (error) {
                console.error('Error getting signed URL:', error);
                reject(error);
            }
            });
    
            fileStream.end(file.buffer); // End the stream, sending the buffer data
        });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  

module.exports = {
  uploadToFirebase
};