"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./course_task.module.css";
import Course_task_item from "./course_task_item";
import { useParams } from "next/navigation";

interface Assignment {
  assignment_id: number;
  title: string;
  description: string;
  max_grade: number;
  submissions_count: number;
  not_submitted_count: number;
  files: { file_name: string; file_path: string }[];
}

const Course_task: React.FC = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); // Роль пользователя
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    max_grade: 0,
    files: [] as File[], // Состояние для файлов
  });

  useEffect(() => {
    if (!courseId) {
      setError("Идентификатор курса отсутствует.");
      return;
    }

    // Получаем роль пользователя
    const token = localStorage.getItem("token");
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/current-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role || "");
        } else {
          console.error("Ошибка при получении роли пользователя");
        }
      } catch (error) {
        console.error("Ошибка при запросе роли пользователя:", error);
      }
    };
    fetchUserRole();

    const fetchAssignments = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/course/${courseId}/assignments`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке заданий");
        }
        const data = await response.json();
        setAssignments(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Не удалось загрузить задания.");
      }
    };

    fetchAssignments();
  }, [courseId]);

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", newAssignment.title);
    formData.append("description", newAssignment.description);
    formData.append("max_grade", newAssignment.max_grade.toString());
    
    // Добавляем файлы в FormData
    newAssignment.files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`/api/course/${courseId}/assignments`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при добавлении задания");
      }
      setIsModalOpen(false); // Закрываем модальное окно
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Не удалось добавить задание.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAssignment({
        ...newAssignment,
        files: Array.from(e.target.files), // Добавляем выбранные файлы в состояние
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}

      {userRole === "Преподаватель" && ( // Проверка роли
        <a
          href="#"
          className={styles.btn_add}
          onClick={() => setIsModalOpen(true)}
        >
          <Image src="/assets/images/plus-white.svg" alt="+" width={16} height={16} />
          <p>Создать</p>
        </a>
      )}

      {assignments.map((assignment) => (
        <Course_task_item key={assignment.assignment_id} assignment={assignment} />
      ))}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Добавить задание</h2>
            <form onSubmit={handleAddAssignment}>
              <label>
                Название:
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, title: e.target.value })
                  }
                />
              </label>
              <label>
                Описание:
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, description: e.target.value })
                  }
                />
              </label>
              <label>
                Максимальная оценка:
                <input
                  type="number"
                  value={newAssignment.max_grade}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, max_grade: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Файлы:
                <input type="file" multiple onChange={handleFileChange} />
              </label>
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Закрыть
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course_task;