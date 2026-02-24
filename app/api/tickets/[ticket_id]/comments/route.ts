import { authenticate } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";



// export async function GET(req: Request) {

// const authuser = authenticate(req);

// if (!authuser) {
//     return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//     );

// }

//     const data = await prisma.ticket_comments.findMany();
//     return NextResponse.json(data);
// }


export async function GET(
  req: Request,
  { params }: { params: { ticket_id: string } }
) {
  const authuser = authenticate(req);

  if (!authuser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const ticketId = Number(params.ticket_id);

//   if (isNaN(ticketId)) {
//     return NextResponse.json(
//       { error: "Invalid ticket id" },
//       { status: 400 }
//     );
//   }

  const comments = await prisma.ticket_comments.findMany({
    where: {
      ticket_id: ticketId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json(comments);
}


export async function POST(req: Request) {

    const authuser = authenticate(req);

    if (!authuser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const body = await req.json();
    const { id, ticket_id, user_id, comment } = body;


    if (!id) {
        return NextResponse.json(
            { error: "id is required" },
            { status: 400 }
        );
    }


    const ticket_comment = await prisma.ticket_comments.create({
        data: {
            id,
            ticket_id,
            user_id,
            comment
        },
    });

    return NextResponse.json(ticket_comment, { status: 201 });
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
    const { id, ticket_id, user_id, comment } = body;

    if (!id) {
        return NextResponse.json(
            { error: "ID required" },
            { status: 400 }
        );
    }

    const ticket_comment = await prisma.ticket_comments.update({
        where: { id },
        data: {
            id,
            ticket_id,
            user_id,
            comment
        },
    });

    return NextResponse.json(ticket_comment);
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

    await prisma.ticket_comments.delete({
        where: { id },
    });

    return NextResponse.json({ message: "comment deleted" });

}

