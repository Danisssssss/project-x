import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../../prisma/prisma-client";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request, { params }: { params: { assignmentId: string } }) {
  const { assignmentId } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const maxGrade = parseInt(formData.get("max_grade")?.toString() || "0", 10);
    const newFiles = formData.getAll("new_files") as File[];

    if (!title || !description || isNaN(maxGrade)) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    // Обновление задания
    const updatedAssignment = await prisma.assignment.update({
      where: { assignment_id: Number(assignmentId) },
      data: {
        title,
        description,
        max_grade: maxGrade,
      },
    });

    // Сохранение новых файлов
    const uploadDir = path.join(process.cwd(), "public", "uploads", `${updatedAssignment.assignment_id}`);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileRecords = [];
    for (const file of newFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, file.name);
      await fs.writeFile(filePath, buffer);

      const fileRecord = await prisma.assignment_Files.create({
        data: {
          file_name: file.name,
          file_path: `/uploads/${updatedAssignment.assignment_id}/${file.name}`,
          file_type: file.type,
        },
      });

      await prisma.assignment_Files_Mappings.create({
        data: {
          assignment_id: updatedAssignment.assignment_id,
          file_id: fileRecord.file_id,
        },
      });

      fileRecords.push(fileRecord);
    }

    return NextResponse.json({ assignment: updatedAssignment, files: fileRecords });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при обновлении заданияsss" }, { status: 500 });
  }
}
