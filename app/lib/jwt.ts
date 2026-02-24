import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "exam_secret_key";

export function generateToken(userId: number, role: any) {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: number,role: string };
}


