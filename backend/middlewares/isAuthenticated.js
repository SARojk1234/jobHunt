import jwt from "jsonwebtoken";

//creating middleware for user login
const isAuthenticated = async (req, res, next) => {
  try {
    //getting token from coookies
    const token = req.cookies.token;
    //validating token
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    //if token exits decode it
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    //validating decode
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    //if token decoded we will get userId which we have pass in login controller
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
