import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Берем токен из заголовка

    if (!token) {
        return NextResponse.json({ message: "Токен не предоставлен" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        
        const user = await prisma.user.findUnique({
            where: { user_id: decoded.userId },
            include: { Role: true }, // Включаем роль, если нужно
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Ошибка при получении текущего пользователя:", error);
        return NextResponse.json({ message: "Ошибка авторизации" }, { status: 500 });
    }
}