import { Router } from "express";
import userController from "../../controller/auth/index.js";
import emailVerification from "../../middlewear/user/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import authValidators from "../../validators/auth/index.js";
const authRouter = Router();
authRouter.post("/auth/signup", authValidators.signUp, userController.signUp);
authRouter.post("/auth/signin", authValidators.signIn, userController.signIn);
authRouter.get(
  "/users",
  authenticateToken,
  checkRole([roles.ADMIN]),
  userController.getAll
);
authRouter.get("/user/:id", userController.getSingle);
authRouter.delete("/user/:id", userController.delete);
authRouter.get("/user/verify/:id/:token", emailVerification);
authRouter.post("/auth/verifytoken", userController.signUpToken);
authRouter.patch(
  "/auth/user/allow/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  userController.allowAccess
);
authRouter.patch(
  "/auth/user/cancel/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  userController.invokeAccess
);
authRouter.put(
  "/user/salary/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  userController.addSalary
);
authRouter.put(
  "/user/:id",
  authenticateToken,
  authValidators.update,
  userController.update
);

export default authRouter;
