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
    user.verified = true;
    await user.save();
    await token.destroy();
    res.send("email verified sucessfully");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      console.log(error);
      res.status(400).send("An error occured");
    }
  }
};

export default emailVerification;
