import jwt from "jsonwebtoken";

const refreshTokenMiddleware = async (req, resp, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return resp.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    const decodedData = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    req.user = decodedData;
    next();
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: "Invalid Refresh Token",
    });
  }
};

export default refreshTokenMiddleware;
