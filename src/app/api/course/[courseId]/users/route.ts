import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-client";

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { course_id: parseInt(courseId) },
      include: {
        Teacher: {
          select: {
            user_id: true,
            name: true,
          },
        },
        Enrollments: {
          include: {
            Student: {
              select: {
                user_id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
    }

    const teachers = [course.Teacher]; // Преподаватель (всего один, так как один преподаватель на курс)
    const students = course.Enrollments.map((enrollment) => enrollment.Student);

    return NextResponse.json({ teachers, students });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при получении данных" }, { status: 500 });
  }
}