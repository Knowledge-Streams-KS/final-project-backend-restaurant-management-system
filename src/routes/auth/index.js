import { Router } from "express";
import userController from "../../controller/auth/index.js";
import emailVerification from "../../middlewear/user/index.js";
import authenticateToken from "../../middlewear/token/index.js";
const authRouter = Router();
authRouter.post("/auth/signup", userController.signUp);
authRouter.post("/auth/signin", userController.signIn);
authRouter.get("/users", authenticateToken, userController.getAll);
authRouter.get("/user/:id", userController.getSingle);
authRouter.delete("/user/:id", userController.delete);
authRouter.get("/user/verify/:id/:token", emailVerification);

export default authRouter;
