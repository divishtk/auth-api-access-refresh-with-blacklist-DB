import { User } from "../models/user.models.js";
import fs from "fs";

const deleteFileIfExists = (filePath) => {
  if (filePath) {
    try {
      fs.unlinkSync(filePath); // Deletes the uploaded file
    } catch (error) {
      console.log("Error deleting file:", error.message);
    }
  }
};


const userResgisterController = async (req, resp, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        deleteFileIfExists(req.file?.path)
      return resp.status(400).json({
        success: false,
        message: "Account already exixts",
      });
    }

    const pic = req.file.filename;

    const saveUserInMongo = await User.create({
      name,
      email,
      mobile,
      password,
      pic,
    });

    await saveUserInMongo.save();
    const createdUserCheck = await User.findById(saveUserInMongo._id);
    if (!createdUserCheck) {
      return resp.status(400).json({
        success: false,
        message: "Something went wrong while user creation",
      });
    }

    deleteFileIfExists(req.file?.path)
    return resp.status(400).json({
      data: createdUserCheck,
      success: true,
      message: "Register Success",
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default userResgisterController;
