"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./course_card.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface CourseCardProps {
  courseId: number; // Используем ID курса для передачи в маршрут
  title: string;
  teacherName?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courseId, title, teacherName }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [newTitle, setNewTitle] = useState(title); // Состояние для нового названия курса
  const [userRole, setUserRole] = useState<string>(""); // Роль пользователя

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (e.target && (e.target as HTMLElement).classList.contains(styles.title)) {
      setBreadcrumbs(title);
      router.push(`/course/${courseId}`);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewTitle(title);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        console.log("Название курса успешно обновлено!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        console.error("Ошибка при обновлении названия курса");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  return (
    <div className={styles.course_card} onClick={handleClick}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        {teacherName && <div className={styles.teacher}>Преподаватель: {teacherName}</div>}
        {userRole === "Преподаватель" && (
          <a href="#" className={styles.more} onClick={handleMoreClick}>
            <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
          </a>
        )}
      </div>
      <div className={styles.bottom}></div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2 className={styles.title_modal}>Редактировать название курса</h2>
            <label>
              <input
                type="text"
                className={styles.input}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>
            <div className={styles.modal_buttons}>
              <button className={styles.cancel} onClick={handleCancel}>Отмена</button>
              <button className={styles.change} onClick={handleSave}>Изменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;