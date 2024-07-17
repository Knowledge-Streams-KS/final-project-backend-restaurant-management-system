import userModel from "../../model/user/index.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/email/index.js";
import tokenModel from "../../model/token/index.js";
import sequelize from "../../db/config.js";

const userController = {
  getAll: async (req, res) => {
    try {
      const users = await userModel.findAll();
      res.status(200).json({
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error!",
      });
    }
  },
  getSingle: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await userModel.findByPk(id);
      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  signUp: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const payload = req.body;
      console.log(payload);
      const user = await userModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (user) {
        return res.status(400).json({
          message: "User already Exists",
        });
      }
      const hpassowrd = await hash(payload.password, 10);
      const newUser = await userModel.create(
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hpassowrd,
          role: payload.role,
        },
        { transaction: t }
      );
      const data = {
        id: newUser.id,
        email: payload.email,
        role: payload.role,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: "5h",
      });
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 5);
      await tokenModel.create(
        {
          token,
          UserId: newUser.id,
          expiresAt,
        },
        { transaction: t }
      );
      const message = `${process.env.BASE_URL}/user/verify/${newUser.id}/${token}`;
      const emailData = {
        fname: payload.firstName,
        lname: payload.lastName,
        link: message,
      };
      await sendEmail(
        payload.email,
        "Verify Email",
        "verify_email.handlebars",
        emailData
      );
      await t.commit();
      res.status(201).json({ message: "An Email was Send!" });
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  signIn: async (req, res) => {
    try {
      const payload = req.body;
      const user = await userModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      const comaprePassword = await compare(payload.password, user.password);
      if (!comaprePassword) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      if (user.verified === false) {
        return res.status(401).json({
          message: "Email not verified",
        });
      }
      if (user.allowAcess === false) {
        return res.status(401).json({
          message: "Access not Allowed",
        });
      }
      const existingToken = await tokenModel.findOne({
        where: { UserId: user.id },
      });
      if (existingToken) {
        await existingToken.destroy();
      }
      const data = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: "5h",
      });
      const expiresAt = new Date();
      // expiresAt.setMinutes(expiresAt.getMinutes() + 1);
      expiresAt.setHours(expiresAt.getHours() + 5);

      await tokenModel.create({
        token,
        UserId: user.id,
        expiresAt,
      });
      const userInfo = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userId: user.id,
      };
      res.status(200).json({ message: "Login Successfully", token, userInfo });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  delete: async (req, res) => {
    try {
      const payload = req.body;
      const user = await userModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      const comaprePassword = await compare(payload.password, user.password);
      if (!comaprePassword) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      await user.destroy();
      res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  update: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      const user = await userModel.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      const comaprePassword = await compare(oldPassword, user.password);
      if (!comaprePassword) {
        return res.status(401).json({
          message: "Invalid Credentials!",
        });
      }
      const hpassowrd = await hash(newPassword, 10);
      user.password = hpassowrd;
      await user.save();
      res.status(200).json({ message: "User Password Updated Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  signUpToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.verified === true) {
        return res.status(401).json({
          message: "User already verified",
        });
      }
      const existingToken = await tokenModel.findOne({
        where: { UserId: user.id },
      });
      if (existingToken) {
        await existingToken.destroy();
      }
      const data = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: "5h",
      });
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 5);

      await tokenModel.create({
        token,
        UserId: user.id,
        expiresAt,
      });
      const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token}`;
      const emailData = {
        fname: user.firstName,
        lname: user.lastName,
        link: message,
      };
      await sendEmail(
        email,
        "Verify Email",
        "verify_email.handlebars",
        emailData
      );

      res
        .status(200)
        .json({ message: "A new verification email has been sent!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addSalary: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(id);
      const { salary } = req.body;
      const checkUser = await userModel.findByPk(id);
      if (!checkUser) {
        return res.status(404).json({ message: `No user with this ${id}` });
      }
      checkUser.salary = salary;
      await checkUser.save();
      res.status(200).json({ message: `Salary of user ${id} updated` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  allowAccess: async (req, res) => {
    try {
      const id = req.params.id;
      const checkUser = await userModel.findByPk(id);
      if (!checkUser) {
        return res.status(404).json({ message: `No user with this ${id}` });
      }
      checkUser.allowAcess = true;
      await checkUser.save();
      res.status(200).json({ message: `Access granted to user ${id}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  invokeAccess: async (req, res) => {
    try {
      const id = req.params.id;
      const checkUser = await userModel.findByPk(id);
      if (!checkUser) {
        return res.status(404).json({ message: `No user with this ${id}` });
      }
      checkUser.allowAcess = false;
      await checkUser.save();
      res.status(200).json({ message: `Access of user ${id} is invoked` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default userController;
