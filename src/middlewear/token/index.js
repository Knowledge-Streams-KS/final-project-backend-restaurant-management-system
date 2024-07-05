import jwt from "jsonwebtoken";
import tokenModel from "../../model/token/index.js";

const authenticateToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Invalid Authorization" });
  }
  token = token.replace("Bearer ", "");
  const tokenCheck = await tokenModel.findOne({
    where: {
      token,
    },
  });
  if (!tokenCheck) {
    return res.status(401).json({ message: "Invalid Authorization" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_Key);
    console.log("userinfo", decoded);
    res.locals.user = decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      console.log(error);
      return res.status(401).json({ message: "Invalid Authorization" });
    }
  }

  next();
};

export default authenticateToken;
