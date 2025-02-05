import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {userResgisterController} from "../controller/user.controller.js";
import registerValidator from "../helpers/validation.helper.js";


const router = Router();



router.route("/register").post(
    upload.single('pic'),
    registerValidator,
    userResgisterController
);



export default router;
