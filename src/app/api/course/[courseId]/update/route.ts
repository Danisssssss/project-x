import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-client";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request, { params }: { params: { assignmentId: string } }) {
  const { assignmentId } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const maxGrade = parseInt(formData.get("max_grade")?.toString() || "0", 10);
    const newFiles = formData.getAll("new_files");

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

    const fileMappings = [];

    // Сохранение файлов и создание записей в таблице Assignment_Files
    for (const file of newFiles) {
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      const filePath = path.join(uploadDir, (file as File).name);
      await fs.writeFile(filePath, buffer);

      // Создание записи о файле в таблице Assignment_Files
      const createdFile = await prisma.assignment_Files.create({
        data: {
          file_name: (file as File).name,
          file_path: `/uploads/${updatedAssignment.assignment_id}/${(file as File).name}`,
          file_type: (file as File).type,
        },
      });

      // Добавление записи в таблицу связи Assignment_Files_Mappings
      fileMappings.push({
        assignment_id: updatedAssignment.assignment_id,
        file_id: createdFile.file_id,
      });
    }

    // Связывание файлов с заданием через Assignment_Files_Mappings
    await prisma.assignment_Files_Mappings.createMany({
      data: fileMappings,
    });

    return NextResponse.json({ assignment: updatedAssignment }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении задания:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}