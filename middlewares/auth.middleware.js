import jwt from "jsonwebtoken";
import { Blacklist } from "../models/blacklist-token.model.js";


const authenticationMiddleware = async (req, resp, next) => {
  try {
    const bearerHeader =
      req.body.token || req.query.token || req.headers["authorization"];
    const accessToken = bearerHeader.split(" ")[1];
    if (!accessToken) {
      return resp.status(401).json({
        message: "Token required for authentication",
      });
    }

    const blacklistedToken = await Blacklist.findOne(
      {
        token : accessToken
      }
    );

    if(blacklistedToken){
      return resp.status(400).json({
        success: false,
        message: "Session is expired, please login again!!",
      });
    }

    const payload = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);
    req.user = payload;
    console.log('er',req.user); // Should show the decoded payload
    next();


  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authenticationMiddleware;
