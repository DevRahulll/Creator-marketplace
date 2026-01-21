import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers";
import { requireAuth } from "../mddlewares/requireAuth";

export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", requireAuth, logoutUser);
authRouter.get("/me", requireAuth, getUserProfile);
