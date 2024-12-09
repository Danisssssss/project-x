import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
    const user = await prisma.user.findMany();

    return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    const user = await prisma.user.create({
        data
    });

    return NextResponse.json(user);
}