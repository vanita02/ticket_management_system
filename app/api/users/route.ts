import { authenticate, authorizeManager } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const data = await prisma.users.findMany();
    return NextResponse.json(data);
}



export async function POST(req: Request) {



    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

     if (authuser.role !== "MANAGER") {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
    }


    const body = await req.json();
    const { id, name, email, password, role_id, } = body;

    if (!email || !password) {
        return NextResponse.json(
            { error: 'Email & Password are required' },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            id,
            name,
            email,
            password: hashedPassword,
            role_id
        }
    })

    return NextResponse.json(user, { status: 201 })

}






