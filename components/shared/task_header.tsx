"use client";

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const TaskHeader = () => {
  const pathname = usePathname(); // Текущий путь
  const { taskId } = useParams(); // Получаем taskId из параметров маршрута
  const [activeLink, setActiveLink] = useState("");
  const [role, setRole] = useState<string | null>(null); // Состояние для роли

  // Функция для получения роли пользователя
  const fetchUserRole = async () => {
    try {
      const res = await fetch("/api/current-role", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Токен из локального хранилища
        },
      });

      const data = await res.json();
      if (data.role) {
        setRole(data.role); // Сохраняем роль пользователя
      }
    } catch (error) {
      console.error("Ошибка при получении роли пользователя:", error);
    }
  };

  useEffect(() => {
    fetchUserRole(); // Получаем роль при монтировании компонента
    setActiveLink(pathname); // Устанавливаем активный элемент
  }, [pathname]);

  const generateLink = (path: string) => `/task/${taskId}${path}`;

  return (
    <div className={styles.header}>
      <Link
        href={`/task/${taskId}`}
        className={`${styles.header_item} ${activeLink === `/task/${taskId}` ? styles.active : ""}`}
      >
        <p>Инструкции</p>
      </Link>

      {/* Проверяем роль и выводим ссылку только для преподавателя */}
      {role === "Преподаватель" && (
        <Link
          href={generateLink("/students_work")}
          className={`${styles.header_item} ${activeLink.includes("/students_work") ? styles.active : ""}`}
        >
          <p>Работы учащихся</p>
        </Link>
      )}
    </div>
  );
};

export default TaskHeader;