import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // For parsing JSON bodies
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.static("./assets"));
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(
    express.json()
  );
  app.use(cookieParser());
  app.use(bodyParser.json());

// app.use('/api/v1/tests',testRouter)
// app.use('/api/v1/auth',authRouter)
// app.use('/api/v1/update',updayePasswordRouter)
// app.use('/api/v1/job',createJobsRouter)


//app.use(errorHandlerMiddlware);


export {app}