import jwt from "jsonwebtoken";
import tokenModel from "../../model/token/index.js";
import userModel from "../../model/user/index.js";

const emailVerification = async (req, res) => {
  try {
    const user = await userModel.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(400).send("Invalid link");
    const token = await tokenModel.findOne({
      where: { token: req.params.token, UserId: req.params.id },
    });
    console.log();
    if (!token) return res.status(400).send("Invalid link");
    try {
      const decoded = jwt.verify(token.token, process.env.JWT_SECRET_KEY);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        await token.destroy();
        return res.status(401).json({ message: "Token Expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    user.verified = true;
    await user.save();
    await token.destroy();
    res.redirect(process.env.HOMEPAGE);
  } catch (error) {
    console.log(error);
    res.status(400).send("An error occured");
  }
};

export default emailVerification;
