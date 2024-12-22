"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../../../components/shared/course_feed.module.css"; // Переиспользуем стили

const CoursePage = () => {
  const { courseId } = useParams(); // Получаем courseId из URL
  const [course, setCourse] = useState<{ title: string } | null>(null); // Указываем тип данных

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          if (response.ok) {
            const courseData = await response.json();
            setCourse(courseData);
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

  if (!course) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <div className={styles.title}>{course.title}</div>
      </div>
      {/* Добавьте сюда другие элементы страницы, если необходимо */}
    </div>
  );
};

export default CoursePage;