
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { id, name, email, password, role_id, } = body;
    
    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password required" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role_id
        },
    });

    return NextResponse.json({
        message: "User registered",
        userId: user.id,
    });
}


