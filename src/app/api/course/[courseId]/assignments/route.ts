import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-client";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const maxGrade = parseInt(formData.get("max_grade")?.toString() || "0", 10);
    const files = formData.getAll("files") as File[];

    if (!title || !description || isNaN(maxGrade)) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    // Создание задания
    const assignment = await prisma.assignment.create({
      data: {
        course_id: Number(courseId),
        title,
        description,
        max_grade: maxGrade,
      },
    });

    // Сохранение файлов
    const uploadDir = path.join(process.cwd(), "public", "uploads", `${assignment.assignment_id}`);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileRecords = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, file.name);
      await fs.writeFile(filePath, buffer);

      const fileRecord = await prisma.assignment_Files.create({
        data: {
          file_name: file.name,
          file_path: `/uploads/${assignment.assignment_id}/${file.name}`,
          file_type: file.type,
        },
      });

      await prisma.assignment_Files_Mappings.create({
        data: {
          assignment_id: assignment.assignment_id,
          file_id: fileRecord.file_id,
        },
      });

      fileRecords.push(fileRecord);
    }

    return NextResponse.json({ assignment, files: fileRecords });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при создании задания" }, { status: 500 });
  }
}

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