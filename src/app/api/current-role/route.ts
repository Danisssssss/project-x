import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
    try {
        // Извлекаем токен из заголовков запроса
        const token = req.headers.get("Authorization")?.split(" ")[1]; // "Bearer <token>"

        if (!token) {
            return NextResponse.json({ message: "Токен не предоставлен" }, { status: 401 });
        }

        // Проверяем и декодируем токен
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Извлекаем роль пользователя по его userId
        const user = await prisma.user.findUnique({
            where: { user_id: decoded.userId },
            include: { Role: true }, // Включаем данные роли
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        // Возвращаем роль пользователя
        return NextResponse.json({ role: user.Role.role_name });
    } catch (error) {
        console.error("Ошибка при получении роли пользователя:", error);
        return NextResponse.json({ message: "Ошибка при получении роли" }, { status: 500 });
    }
}
