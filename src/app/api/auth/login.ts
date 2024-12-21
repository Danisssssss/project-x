import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key"; // Вставьте свой секретный ключ

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
        where: { email },
        include: { Role: true },
    });

    if (!user) {
        return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    // Генерация JWT токена
    const token = jwt.sign(
        { userId: user.user_id, role: user.Role.role_name },
        SECRET_KEY,
        { expiresIn: "1h" } // Токен действует 1 час
    );

    return NextResponse.json({ token });
}