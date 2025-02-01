import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();



router.route("/resgister").post(
    upload.single('image'),
);



export default router;
