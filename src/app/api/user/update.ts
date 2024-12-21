// API для обновления данных пользователя
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

export async function PUT(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ message: "Токен не предоставлен" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { name, email } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { user_id: decoded.userId },
            data: {
                name,
                email,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Ошибка при обновлении данных пользователя:", error);
        return NextResponse.json({ message: "Ошибка обновления данных" }, { status: 500 });
    }
}
