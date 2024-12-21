import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import bcrypt from "bcrypt";

export async function GET() {
    const user = await prisma.user.findMany();

    return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    // Хэширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword, // Сохраняем хэшированный пароль
        },
    });

    return NextResponse.json(user);
}