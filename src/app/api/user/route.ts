import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import bcrypt from "bcrypt";

export async function GET() {
    try {
        // Получение всех пользователей с ролью "Студент"
        const students = await prisma.user.findMany({
            where: {
                Role: {
                    role_name: "Студент", // Фильтр по имени роли
                },
            },
            select: {
                user_id: true,
                name: true,
            },
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error("Ошибка при получении списка студентов:", error);
        return NextResponse.json({ error: "Ошибка при загрузке списка студентов" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    // Хэширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, // Сохраняем хэшированный пароль
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
        return NextResponse.json({ error: "Ошибка при создании пользователя" }, { status: 500 });
    }
}