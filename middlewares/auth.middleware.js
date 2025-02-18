import jwt from "jsonwebtoken";

const authenticationMiddleware = async (req, resp, next) => {
  try {
    const bearerHeader =
      req.body.token || req.query.token || req.headers["authorization"];
    const accessToken = bearerHeader.split(" ")[1];
    console.log(accessToken)
    if (!accessToken) {
      return resp.status(401).json({
        message: "Token required for authentication",
      });
    }
    const payload = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);
    req.user = payload;
    next();


  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authenticationMiddleware;
