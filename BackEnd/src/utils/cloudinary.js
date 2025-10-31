const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { CLOUDINARY } = require("../config/env");



// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY.NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {

    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfull
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    throw error;
  }
};
module.exports = uploadOnCloudinary;
