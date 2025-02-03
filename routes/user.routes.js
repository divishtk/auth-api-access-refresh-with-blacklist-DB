import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import userResgisterController from "../controller/user.controller.js";

const router = Router();



router.route("/register").post(
    upload.single('pic'),
    userResgisterController
);



export default router;
