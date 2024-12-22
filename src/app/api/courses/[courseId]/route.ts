import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client"; // Убедитесь, что путь к Prisma клиенту правильный

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