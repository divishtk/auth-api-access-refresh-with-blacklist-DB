import { User } from "../models/user.models.js";
import fs from "fs";
import { validationResult } from "express-validator";
import { sendEmails } from "../helpers/sendMails.helper.js";
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        message: "Error occured",
        errors: errors.array(),
      });
    }
    const { name, email, mobileNo, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      deleteFileIfExists(req.file?.path);
      return resp.status(400).json({
        success: false,
        message: "Account already exixts",
      });
    }

    const pic = req.file.filename;

    const saveUserInMongo = await User.create({
      name,
      email,
      mobileNo,
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

    deleteFileIfExists(req.file?.path);

   const message = `<p>Hey ${name}, Welcome! Please verify your email by clicking <a href="http://127.0.0.1:8080/mail-verification?id=${saveUserInMongo._id}">here</a>.</p>`;

   await sendEmails(email , "Mail Verification" , message)
   

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
