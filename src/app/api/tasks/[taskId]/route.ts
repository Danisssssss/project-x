import { prisma } from '../../../../../prisma/prisma-client';  // Убедитесь, что prisma настроен правильно

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId, 10);

  // Получаем задание по ID
  const task = await prisma.assignment.findUnique({
    where: { assignment_id: taskId },
    include: {
      // Включаем связанные данные (например, файлы и подачу)
      Files: true,
      Submissions: true,
    },
  });

  if (!task) {
    return new Response('Задание не найдено', { status: 404 });
  }

  return new Response(JSON.stringify(task), { status: 200 });
}
