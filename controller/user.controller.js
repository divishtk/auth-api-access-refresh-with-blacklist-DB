import { User } from "../models/user.models.js";
import fs from "fs";
import { validationResult } from "express-validator";
import { sendEmails } from "../helpers/sendMails.helper.js";
import randomstring from "randomstring";
import { PasswordReset } from "../models/forgot-password.models.js";
import jwt from "jsonwebtoken";

const deleteFileIfExists = (filePath) => {
  if (filePath) {
    try {
      fs.unlinkSync(filePath); // Deletes the uploaded file
    } catch (error) {
      console.log("Error deleting file:", error.message);
    }
  }
};

const generateAccessToken = async (user) => {
  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(userPayload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = async (user) => {
  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
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

    const message = `<p>Hey ${name}, Welcome! Please verify your email by clicking<a href="http://127.0.0.1:8080/mail-verification?id=${saveUserInMongo._id}">here</a>.</p>`;

    await sendEmails(email, "Mail Verification", message);

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

const mailVerificationController = async (req, resp, next) => {
  try {
    console.log(req.query.id);
    if (req.query.id === undefined) {
      return resp.render("404.view.ejs");
    }

    const userId = await User.findOne({
      _id: req.query.id,
    });

    if (userId) {
      if (userId.isVerified === 1) {
        return resp.render("mailVerification.view.ejs", {
          message: "Your email already verified",
        });
      }
      await User.findByIdAndUpdate(
        {
          _id: req.query.id,
        },
        {
          $set: {
            isVerified: 1,
          },
        }
      );
      return resp.render("mailVerification.view.ejs", {
        message: "Mail Verified Successfully",
      });
    } else {
      resp.render("404.view.ejs", {
        message: "User not found!!",
      });
    }
  } catch (error) {
    return resp.render("404.view.ejs");
  }
};
//api for email verfication in case of user delete the verify mail
const sendEmailVerificationController = async (req, resp, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        message: "Error occured",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const emailData = await User.findOne({ email });
    console.log(emailData);
    if (!emailData) {
      return resp.status(400).json({
        success: false,
        message: "Email not exists!",
        errors: errors.array(),
      });
    }
    if (emailData.isVerified == 1) {
      return resp.status(400).json({
        success: false,
        message: `Your email ${emailData.email} is already verified`,
      });
    }
    const message = `<p>Hey ${emailData.name}, Welcome! Please verify your email by clicking<a href="http://127.0.0.1:8080/mail-verification?id=${emailData._id}">here</a>.</p>`;
    await sendEmails(email, "Mail Verification", message);
    return resp.status(400).json({
      success: false,
      message: `Verification link sent to your email`,
    });
  } catch (error) {
    console.log(error.message);
    return resp.render("404.view.ejs");
  }
};

const forgetPasswordController = async (req, resp) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        message: "Error occured",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const emailData = await User.findOne({ email });
    console.log(emailData);
    if (!emailData) {
      return resp.status(400).json({
        success: false,
        message: "Email not exists!",
        errors: errors.array(),
      });
    }

    const dummyString = randomstring.generate();
    const msg = `
                <p>Hey ${emailData.name} Please click <a href = "http://127.0.0.1:8080/reset-password?token=${dummyString}">here</a>
                 here to reset your password</p>`;

    await PasswordReset.deleteMany({ user_id: emailData._id });
    const passwordReset = await PasswordReset.create({
      user_id: emailData._id,
      token: dummyString,
    });

    await passwordReset.save();
    await sendEmails(emailData.email, "Reset Passowrd", msg);

    return resp.status(201).json({
      success: true,
      message: "Link for password reset sent!",
    });
  } catch (error) {
    console.log(error.message);
    return resp.render("404.view.ejs");
  }
};

const resetPasswordAuth = async (req, resp) => {
  try {
    if (req.query.token === undefined) {
      return resp.render("404.view.ejs");
    }

    const resetData = await PasswordReset.findOne({
      token: req.query.token,
    });

    if (!resetData) {
      return resp.render("404.view.ejs");
    }
    return resp.render("reset-password", {
      resetData,
    });
  } catch (error) {}
};

const updatePasswordAuth = async (req, resp) => {
  try {
    const { user_id, password, confirm_password } = req.body;
    const resetData = await PasswordReset.findOne({ user_id });
    if (password != confirm_password) {
      resp.render("reset-password", {
        resetData,
        error: "Confirm password not matched",
      });
    }

    // await User.findByIdAndUpdate(
    //   {
    //     _id: user_id,
    //   },
    //   {
    //     $set: {
    //       password: confirm_password,
    //     },
    //   }
    // );

    const user = await User.findById({
      _id: user_id,
    });

    user.password = confirm_password;
    await user.save();

    await PasswordReset.deleteMany({ user_id });
    resp.redirect("/reset-success");
  } catch (error) {
    resp.render("404.view.ejs");
  }
};

const resetSuccessController = async (req, resp) => {
  try {
    resp.render("reset-success");
  } catch (error) {}
};

const loginController = async (req, resp) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        message: "Error occured",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "Account doesnot exists, please create account",
      });
    }

    const checkPassword = await user.isMatchPassword(password);
    if (!checkPassword) {
      return resp.status(401).json({
        success: false,
        message: "Please provide the correct password",
      });
    }

    if (user.isVerified === 0) {
      return resp.status(401).json({
        success: false,
        message: "Please verify your account",
      });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return resp.status(201).json({
      success: true,
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: "Bearer",
      message: "Logged in",
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getProfile = async (req, resp) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
    });

    return resp.status(201).json({
      success: true,
      data: user,
      message: "User Profile",
    });
  } catch (error) {}
};

const updateProfileController = async (req, resp) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        message: "Error occured",
        errors: errors.array(),
      });
    }
    const { name, mobileNo } = req.body;
    const userId = req.user._id;
    const data = {
      name,
      mobileNo,
    };

    if (req.file !== undefined) {
      data.pic = req.file.filename;
      deleteFileIfExists(req.file.path);
    }

    const updateUser = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $set: data,
      },
      {
        new: true,
      }
    );
    return resp.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile Updated",
    });
  } catch (error) {
    console.log(error);
    return resp.status(401).json({
      success: false,
      error: "Error occured while updating",
    });
  }
};

const refreshTokenController = async (req, resp) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });
    const newAccessToken = await generateAccessToken(user);
    const newRefeshToken = await generateRefreshToken(user);
    return resp.status(201).json({
      success: true,
      message: "Token Refreshed Successfully",
      newAccessToken: newAccessToken,
      newRefeshToken: newRefeshToken,
    });
  } catch (error) {}
};

export {
  userResgisterController,
  mailVerificationController,
  sendEmailVerificationController,
  forgetPasswordController,
  resetPasswordAuth,
  updatePasswordAuth,
  resetSuccessController,
  loginController,
  getProfile,
  updateProfileController,
  refreshTokenController,
};
