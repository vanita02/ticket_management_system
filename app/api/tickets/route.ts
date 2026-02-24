import { authenticate, authorizeManager, authorizeUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const data = await prisma.tickets.findMany();
    return NextResponse.json(data);
}

export async function POST(req: Request) {


    // const manager = authorizeManager(req);
    // const user = authorizeUser(req);


    // if (!manager || !user) {
    //     return NextResponse.json(
    //         { error: "Access denied" },
    //         { status: 403 }
    //     );
    // }

    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (authuser.role !== "MANAGER" && authuser.role !== "USER") {
        return NextResponse.json(
            { error: "Access denied" },
            { status: 403 }
        );
    }



    const body = await req.json();
    const { id, title, description, status, priority, created_by, assigned_to } = body;


    if (!id) {
        return NextResponse.json(
            { error: "id is required" },
            { status: 400 }
        );
    }

    if (!title) {
        return NextResponse.json(
            { error: "Title is required" },
            { status: 400 }
        );
    }

    const ticket = await prisma.tickets.create({
        data: {
            id,
            title,
            description,
            status,
            priority,
            created_by,
            assigned_to
        },
    });

    return NextResponse.json(ticket, { status: 201 });
}


export async function PUT(req: Request) {

    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const body = await req.json();
    const { id, title, description, status, priority, created_by, assigned_to } = body;

    if (!id) {
        return NextResponse.json(
            { error: "ticket ID required" },
            { status: 400 }
        );
    }

    const ticket = await prisma.tickets.update({
        where: { id },
        data: {
            id,
            title,
            description,
            status,
            priority,
            created_by,
            assigned_to
        },
    });

    return NextResponse.json(ticket);
}

export async function DELETE(req: Request) {

    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json(
            { error: "ticket ID required" },
            { status: 400 }
        );
    }

    await prisma.tickets.delete({
        where: { id },
    });

    return NextResponse.json({ message: "ticket deleted" });

}

