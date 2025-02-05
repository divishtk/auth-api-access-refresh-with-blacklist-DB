import { Router } from "express";
import { mailVerificationController } from "../controller/user.controller.js";


const router = Router();



router.route("/mail-verification").get(mailVerificationController);



export default router;
