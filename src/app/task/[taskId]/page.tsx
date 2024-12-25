"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Task_instruction from "../../../../components/shared/task_instruction";

interface File {
  file_name: string;
  file_path: string;
}

interface Task {
  title: string;
  description: string;
  max_grade: number;
  Files: File[];
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId) {
      fetch(`/api/tasks/${taskId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Добавьте это для проверки данных
          setTaskData(data);
        });
    }
  }, [taskId]);

  if (!taskData) return <div>Загрузка...</div>;

  return (
    <Task_instruction
      title={taskData.title}
      description={taskData.description}
      max_grade={taskData.max_grade}
      files={taskData.Files}
    />
  );
}