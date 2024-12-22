import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../prisma/prisma-client";

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const body = await request.json();
  const { studentId } = body;

  try {
    // Проверяем, существует ли курс
    const course = await prisma.course.findUnique({ where: { course_id: parseInt(courseId) } });
    if (!course) {
      return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
    }

    // Проверяем, существует ли студент
    const student = await prisma.user.findUnique({ where: { user_id: studentId } });
    if (!student) {
      return NextResponse.json({ error: "Студент не найден" }, { status: 404 });
    }

    // Проверяем, зачислен ли студент на курс
    const enrollmentExists = await prisma.course_Enrollment.findFirst({
      where: {
        course_id: parseInt(courseId),
        student_id: studentId,
      },
    });

    if (enrollmentExists) {
      return NextResponse.json({ error: "Студент уже зачислен на курс" }, { status: 400 });
    }

    // Добавляем студента на курс
    await prisma.course_Enrollment.create({
      data: {
        course_id: parseInt(courseId),
        student_id: studentId,
      },
    });

    return NextResponse.json({ message: "Студент успешно добавлен" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при добавлении студента" }, { status: 500 });
  }
}