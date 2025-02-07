import { Router } from "express";
import { mailVerificationController, resetPasswordAuth, resetSuccessController, updatePasswordAuth } from "../controller/user.controller.js";


const router = Router();



router.route("/mail-verification").get(mailVerificationController);
router.route("/reset-password").get(resetPasswordAuth);
router.route("/reset-your-password").post(updatePasswordAuth);
router.route("/reset-success").get(resetSuccessController);





export default router;
