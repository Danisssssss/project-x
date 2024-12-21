import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Ищем пользователя по email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log("Пользователь не найден:", email);
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Неверный пароль для пользователя:", email);
            return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
        }

        // Генерация JWT
        const token = jwt.sign(
            { userId: user.user_id, role: user.role_id },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        // Возвращаем токен и данные пользователя (включая fullName)
        return NextResponse.json({ token, fullName: user.name });
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        return NextResponse.json({ message: "Ошибка авторизации" }, { status: 500 });
    }
}