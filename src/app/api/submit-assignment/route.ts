import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { assignment_id, student_id } = req.body;
    const files = req.files as Express.Multer.File[]; // Если используешь multer для обработки файлов

    try {
      // Сохраняем сдачу задания
      const submission = await prisma.submission.create({
        data: {
          assignment_id: parseInt(assignment_id),
          student_id: parseInt(student_id),
          submission_date: new Date(),
        },
      });

      // Сохраняем файлы сдачи задания
      for (const file of files) {
        await prisma.submissionFiles.create({
          data: {
            submission_id: submission.submission_id,
            file_name: file.originalname,
            file_path: file.path,
          },
        });
      }

      res.status(200).json({ message: "Задание успешно сдано!" });
    } catch (error) {
      res.status(500).json({ error: "Ошибка при сдаче задания." });
    }
  } else {
    res.status(405).json({ error: "Метод не разрешен" });
  }
}