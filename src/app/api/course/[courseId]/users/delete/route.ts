import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../prisma/prisma-client";

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;
    const { userId } = await req.json(); // Ожидаем, что userId будет передан в теле запроса

    if (!userId) {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 }
        );
    }

    try {
        // Проверяем, что курс существует
        const course = await prisma.course.findUnique({
            where: { course_id: parseInt(courseId) },
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Проверяем, что студент записан на курс
        const enrollment = await prisma.course_Enrollment.findFirst({
            where: {
                course_id: parseInt(courseId),
                student_id: userId,
            },
        });

        if (!enrollment) {
            return NextResponse.json(
                { error: "User is not enrolled in this course" },
                { status: 404 }
            );
        }

        // Удаляем запись о студенте на курсе
        await prisma.course_Enrollment.delete({
            where: {
                enrollment_id: enrollment.enrollment_id,
            },
        });

        return NextResponse.json(
            { message: "User successfully removed from the course" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while removing the user from the course" },
            { status: 500 }
        );
    }
}