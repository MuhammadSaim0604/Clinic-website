import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

/**
 * Environment
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Token Schema
 */
export const TokenSchema = z.object({
  id: z.string().optional(),
  role: z.string(),
  username: z.string(),
});

export type TokenPayload = z.infer<typeof TokenSchema>;

/**
 * Generate JWT
 */
export const generateToken = (user: TokenPayload): string => {
  const payload = TokenSchema.parse(user);

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * Verify JWT
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const parsed = TokenSchema.safeParse(decoded);

    if (!parsed.success) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

/**
 * Decode JWT (without verifying signature)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token);

    const parsed = TokenSchema.safeParse(decoded);

    if (!parsed.success) return null;

    return parsed.data;
  } catch {
    return null;
  }
};
