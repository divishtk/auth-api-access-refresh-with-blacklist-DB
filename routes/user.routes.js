import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {forgetPasswordController, getProfile, loginController, sendEmailVerificationController, updateProfileController, userResgisterController} from "../controller/user.controller.js";
import {emailCheckValidatorForPasswordReset, loginValidatior, registerValidator, sendEmailApiVerifier} from "../helpers/validation.helper.js";
import authenticationMiddleware from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/register").post(
    upload.single('pic'),
    registerValidator,
    userResgisterController
);

router.route("/send-email-verification").post(sendEmailApiVerifier, sendEmailVerificationController)
router.route("/reset-password").post(emailCheckValidatorForPasswordReset, forgetPasswordController)
router.route("/login").post(loginValidatior, loginController)
router.route("/get-profile").post(authenticationMiddleware,getProfile);
router.route("/update-profile").post(authenticationMiddleware,upload.single('pic'),updateProfileController);




export default router;
