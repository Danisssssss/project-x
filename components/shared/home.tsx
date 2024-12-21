"use client";

import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import CourseCard from "../ui/course_card";

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([]); // Храним курсы
  const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("Пользователь не авторизован");
          return;
        }

        const response = await fetch("/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data); // Сохраняем полученные курсы
        } else {
          console.error("Ошибка при получении курсов");
        }
      } catch (error) {
        console.error("Ошибка при запросе курсов:", error);
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className={styles.home}>
      {loading ? (
        <div>Загрузка...</div> // Показываем загрузку
      ) : (
        courses.map((course) => (
          <CourseCard key={course.course_id} title={course.title} />
        ))
      )}
    </div>
  );
};

export default Home;