import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { message: "Имя и email обязательны для обновления" },
                { status: 400 }
            );
        }

        // Обновление данных пользователя в базе данных
        const updatedUser = await prisma.user.update({
            where: { email }, // Используем email текущего пользователя
            data: {
                name,
            },
        });

        console.log("Обновленные данные пользователя:", updatedUser);

        return NextResponse.json({ message: "Данные успешно обновлены" });
    } catch (error) {
        console.error("Ошибка при обработке запроса:", error);
        return NextResponse.json(
            { message: "Произошла ошибка при обновлении данных" },
            { status: 500 }
        );
    }
}