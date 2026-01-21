import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../lib/authjwt";
import { User } from "../models/User";

export type AuthedRequest = Request & {
  user?: {
    id: string;
    name: string;
    email: string;
    isCreator: Boolean;
  };
};

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME!];

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized user! Please Login.",
      });
    }

    const payload = verifyJwt(token);
    // user id is store in payload of jwt
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Invalid session",
      });
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      isCreator: user.isCreator,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      error: "Invalid session",
    });
  }
}
