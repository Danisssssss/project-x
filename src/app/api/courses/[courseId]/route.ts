import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client"; // Убедитесь, что путь к Prisma клиенту правильный

// Обработчик GET-запроса
export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  const courseId = Number(params.courseId);

  const course = await prisma.course.findUnique({
    where: { course_id: courseId },
    include: {
      Teacher: true,
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }

  return NextResponse.json(course);
}

// Обработчик PUT-запроса
export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  const courseId = Number(params.courseId);
  const { title } = await req.json(); // Извлекаем новое название курса из тела запроса

  if (!title) {
    return NextResponse.json({ error: "Название курса не указано" }, { status: 400 });
  }

  try {
    // Обновление названия курса в базе данных
    const updatedCourse = await prisma.course.update({
      where: { course_id: courseId },
      data: { title }, // Обновляем только название курса
    });

    return NextResponse.json(updatedCourse); // Возвращаем обновленный курс
  } catch (error) {
    console.error("Ошибка при обновлении курса:", error);
    return NextResponse.json({ error: "Ошибка при обновлении названия курса" }, { status: 500 });
  }
}