import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}


export function authorizeManager(req: Request) {
  const user = authenticate(req);

  if (!user || user.role !== "MANAGER") {
    return null;
  }

  return user;
}


export function authorizeUser(req: Request) {
  const user = authenticate(req);

  if (!user || user.role !== "USER") {
    return null;
  }

  return user;
}
