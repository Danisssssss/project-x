import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
    const course = await prisma.course.findMany();

    return NextResponse.json(course);
}