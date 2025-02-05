import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {sendEmailVerificationController, userResgisterController} from "../controller/user.controller.js";
import {registerValidator, sendEmailApiVerifier} from "../helpers/validation.helper.js";


const router = Router();



router.route("/register").post(
    upload.single('pic'),
    registerValidator,
    userResgisterController
);

router.route("/send-email-verification").post(sendEmailApiVerifier, sendEmailVerificationController)



export default router;
