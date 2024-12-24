"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./course_card.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface CourseCardProps {
  courseId: number;  // Используем ID курса для передачи в маршрут
  title: string;
  teacherName?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courseId, title, teacherName }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [newTitle, setNewTitle] = useState(title); // Состояние для нового названия курса

  const handleClick = (e: React.MouseEvent) => {
    // Проверяем, что клик был именно по элементу с классом title
    if (e.target && (e.target as HTMLElement).classList.contains(styles.title)) {
      setBreadcrumbs(title);
      router.push(`/course/${courseId}`);  // Переход по динамическому маршруту
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем переход по клику на карточку
    setIsModalOpen(true); // Открываем модальное окно
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Закрываем модальное окно без изменений
    setNewTitle(title); // Возвращаем исходное название
  };

  const handleSave = async () => {
    try {
      // Отправляем запрос на сервер для обновления названия курса
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }), // Отправляем новое название курса
      });

      if (response.ok) {
        console.log("Название курса успешно обновлено!");
        setIsModalOpen(false); // Закрываем модальное окно
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
        <a href="#" className={styles.more} onClick={handleMoreClick}>
          <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
        </a>
      </div>
      <div className={styles.bottom}></div>

      {/* Модальное окно для редактирования названия курса */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2 className={styles.title_modal}>Редактировать название курса</h2>
            <label>
              <input
                type="text"
                className={styles.input}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} // Обновляем состояние нового названия
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