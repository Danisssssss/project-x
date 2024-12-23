import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-client";

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  try {
    const assignments = await prisma.assignment.findMany({
      where: { course_id: Number(courseId) },
      include: {
        Files: {
          select: { File: { select: { file_name: true, file_path: true } } },
        },
        Submissions: true,
      },
    });

    const formattedAssignments = assignments.map((assignment) => ({
      assignment_id: assignment.assignment_id,
      title: assignment.title,
      description: assignment.description,
      max_grade: assignment.max_grade,
      submissions_count: assignment.Submissions.filter((sub) => sub.grade !== null).length,
      not_submitted_count: assignment.Submissions.filter((sub) => sub.grade === null).length,
      files: assignment.Files.map((file) => ({
        file_name: file.File.file_name,
        file_path: file.File.file_path,
      })),
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при загрузке заданий" }, { status: 500 });
  }
}