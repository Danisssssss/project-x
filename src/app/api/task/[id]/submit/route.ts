import { prisma } from "../../../../../../prisma/prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query; // ID задания
  const { student_id, files } = req.body; // ID студента и файлы

  if (!id || !student_id || !files || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Создаем сдачу задания
    const submission = await prisma.submission.create({
      data: {
        assignment_id: parseInt(id, 10),
        student_id,
      },
    });

    // Добавляем файлы к сдаче
    const fileRecords = await Promise.all(
      files.map((file: { file_name: string; file_path: string; file_type: string }) =>
        prisma.submission_Files.create({
          data: {
            file_name: file.file_name,
            file_path: file.file_path,
            file_type: file.file_type,
          },
        })
      )
    );

    // Создаем связи между сдачей и файлами
    await Promise.all(
      fileRecords.map((file) =>
        prisma.submission_Files_Mappings.create({
          data: {
            submission_id: submission.submission_id,
            file_id: file.file_id,
          },
        })
      )
    );

    res.status(201).json({ message: "Submission created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}