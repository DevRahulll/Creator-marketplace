import type { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, signJwt, verifyPassword } from "../lib/authjwt";
import { AuthedRequest } from "../mddlewares/requireAuth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: "name, email, password required",
      });
    }

    const existsUser = await User.findOne({
      email: String(email).toLowerCase(),
    }).lean();

    if (existsUser) {
      return res.status(400).json({
        ok: false,
        error: "Email already taken",
      });
    }

    const passwordHash = await hashPassword(String(password));

    const newlyCreatedUser = await User.create({
      name: String(name),
      email: String(email).toLowerCase(),
      passwordHash,
      isCreator: false,
    });

    return res.status(201).json({
      ok: true,
      message: "Account created successfully!",
      user: {
        id: String(newlyCreatedUser._id),
        name: newlyCreatedUser.name,
        email: newlyCreatedUser.email,
        isCreator: newlyCreatedUser.isCreator,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: "Internal Sever Error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: "email, password required",
      });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "Invalid Credentials",
      });
    }

    const verifiedPassword = await verifyPassword(
      String(password),
      user.passwordHash,
    );

    if (!verifiedPassword) {
      return res.status(400).json({
        ok: false,
        error: "Invalid Credentials",
      });
    }

    const token = signJwt({ userId: String(user._id) });
    res.cookie(process.env.COOKIE_NAME!, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      ok: true,
      message: "user loggedIn successfully!",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        isCreator: user.isCreator,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: "Internal Sever Error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME!, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({
      ok: true,
      message: "User LoggedOut successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const getUserProfile = async (req: AuthedRequest, res: Response) => {
  try {
    return res.status(200).json({
      ok: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
