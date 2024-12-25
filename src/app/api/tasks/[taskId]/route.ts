import { prisma } from '../../../../../prisma/prisma-client';  // Убедитесь, что prisma настроен правильно

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId, 10);

  const task = await prisma.assignment.findUnique({
    where: { assignment_id: taskId },
    include: {
      Files: {
        include: {
          File: true, // Включаем данные о файле
        },
      },
      Course: {
        include: {
          Teacher: true, // Включаем преподавателя курса
        },
      },
    },
  });

  if (!task) {
    return new Response('Задание не найдено', { status: 404 });
  }

  // Преобразуем данные для возврата
  const responseData = {
    title: task.title,
    description: task.description,
    max_grade: task.max_grade,
    Files: task.Files.map(mapping => ({
      file_name: mapping.File.file_name,
      file_path: mapping.File.file_path,
    })),
    Teacher: task.Course.Teacher, // Вытаскиваем преподавателя
  };

  return new Response(JSON.stringify(responseData), { status: 200 });
}
