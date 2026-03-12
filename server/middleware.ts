import { Request, Response, NextFunction } from "express";
import { verifyToken, decodeToken } from "./jwt";

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const verified = verifyToken(token);

    if (!verified) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const payload = decodeToken(token);

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    // Attach user to request
    (req as any).user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Authentication failed" });
  }
};
