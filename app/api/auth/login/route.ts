import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { generateToken } from "@/app/lib/jwt";
import { roles_name } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: { email },
    include: {
      roles: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = generateToken(user.id, user.roles.name);

  return NextResponse.json({
    message: "Login successful",
    token,
  });
}


// userid=3
// tocken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc3MTkxMzAxNywiZXhwIjoxNzcxOTE2NjE3fQ.Ivws3B7DR3DLjaASdwfdIH6vuIztkxeC9QoVDH86qFM


