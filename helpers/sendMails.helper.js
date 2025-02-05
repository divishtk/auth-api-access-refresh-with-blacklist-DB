import nodemailer from "nodemailer";
import dotenv from "dotenv"


dotenv.config();

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


const sendEmails = async (email, subject, content) => {
  try {
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content,
    };
    mailTransporter.sendMail(mailOptions,(err ,info) =>{

        if(err) {
            console.log('Error', err)
        }else{
            console.log("Mail sent" ,info.messageId)
        }
    })

  } catch (error) {}
};

export {sendEmails}
