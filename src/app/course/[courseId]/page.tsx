"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "../../../../components/shared/course_feed.module.css"; // Переиспользуем стили

const CoursePage = () => {
  const { courseId } = useParams(); // Получаем courseId из URL
  const [course, setCourse] = useState<{ title: string } | null>(null); // Указываем тип данных
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [newTitle, setNewTitle] = useState(course?.title || ""); // Состояние для нового названия курса

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          if (response.ok) {
            const courseData = await response.json();
            setCourse(courseData);
            setNewTitle(courseData.title); // Инициализируем новое название курса
          } else {
            console.error("Ошибка загрузки данных курса");
          }
        } catch (error) {
          console.error("Ошибка при запросе:", error);
        }
      };

      fetchCourse();
    }
  }, [courseId]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем переход по клику на карточку
    setIsModalOpen(true); // Открываем модальное окно
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Закрываем модальное окно без изменений
    setNewTitle(course?.title || ""); // Возвращаем исходное название
  };

  const handleSave = async () => {
    if (newTitle !== course?.title) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        });

        if (response.ok) {
          const updatedCourse = await response.json();
          setCourse(updatedCourse); // Обновляем курс с новым названием
          setIsModalOpen(false); // Закрываем модальное окно
        } else {
          console.error("Ошибка при обновлении курса");
        }
      } catch (error) {
        console.error("Ошибка при запросе:", error);
      }
    } else {
      setIsModalOpen(false); // Закрываем модальное окно, если название не изменилось
    }
  };

  if (!course) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <div className={styles.title}>{course.title}</div>
        <div className={styles.more} onClick={handleMoreClick}>
          <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
        </div>
      </div>

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

export default CoursePage;