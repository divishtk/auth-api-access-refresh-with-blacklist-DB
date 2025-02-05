import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // For parsing JSON bodies
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import authRoute from "./routes/auth.routes.js"

const app = express();
app.use(cors());
app.use(express.static("./assets"));

app.set('view engine','ejs');
app.set('views','./views')

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(
    express.json()
  );
  app.use(cookieParser());
  app.use(bodyParser.json());

app.use('/api/v1/user',userRouter)
app.use('/',authRoute)

// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/update',updayePasswordRouter)
// app.use('/api/v1/job',createJobsRouter)


//app.use(errorHandlerMiddlware);


export {app}