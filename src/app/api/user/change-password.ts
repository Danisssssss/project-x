// API для изменения пароля
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

export async function PUT(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ message: "Токен не предоставлен" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { oldPassword, newPassword } = await req.json();

        const user = await prisma.user.findUnique({
            where: { user_id: decoded.userId },
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return NextResponse.json({ message: "Неверный старый пароль" }, { status: 401 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: { user_id: decoded.userId },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Ошибка при изменении пароля:", error);
        return NextResponse.json({ message: "Ошибка изменения пароля" }, { status: 500 });
    }
}