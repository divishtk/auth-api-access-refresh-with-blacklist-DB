import { check } from "express-validator";

const registerValidator = [
    check('name','Name is required').not().isEmpty(),
    check('email',"Please inculde valid email id").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('mobileNo',"It should be of 10 digits").isLength({
        min :10,
        max:10
    }),
    check('password',"Password must be > then 6 chars, & contains 1 uppercase & atlease 1 lowercase letter, 1 no & 1 symbol")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    }),
    check('pic',"").custom((val , {req}) =>{
        if(req.file.mimetype === "image/jpeg" ||req.file.mimetype === "image/png" ){
            return true
        }
        else{
            return false;
        }
    }).withMessage("Please upload image with jpg/png")

]

const sendEmailApiVerifier = [
    check('email',"Please inculde valid email id").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]
const emailCheckValidatorForPasswordReset = [
    check('email',"Please inculde valid email id").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

const loginValidatior = [
    check('email',"Please inculde valid email id").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password',"Please inculde password").not().isEmpty()
]


const updateProfileValidator = [
    check('name','Name is required').not().isEmpty(),
    check('mobileNo',"It should be of 10 digits").isLength({
        min :10,
        max:10
    })
]

export  {registerValidator,sendEmailApiVerifier,emailCheckValidatorForPasswordReset,loginValidatior,updateProfileValidator}