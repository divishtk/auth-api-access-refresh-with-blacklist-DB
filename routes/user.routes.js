import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {forgetPasswordController, sendEmailVerificationController, userResgisterController} from "../controller/user.controller.js";
import {emailCheckValidatorForPasswordReset, registerValidator, sendEmailApiVerifier} from "../helpers/validation.helper.js";


const router = Router();



router.route("/register").post(
    upload.single('pic'),
    registerValidator,
    userResgisterController
);

router.route("/send-email-verification").post(sendEmailApiVerifier, sendEmailVerificationController)
router.route("/reset-password").post(emailCheckValidatorForPasswordReset, forgetPasswordController)



export default router;
