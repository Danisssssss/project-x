"use client"; // Убедитесь, что это присутствует в начале файла

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Используем usePathname вместо useRouter

const TaskHeader = () => {
  const pathname = usePathname(); // Получаем текущий путь
  const [activeLink, setActiveLink] = useState("/task/instruction");

  // Используем useEffect, чтобы установить активный элемент при загрузке страницы
  useEffect(() => {
    setActiveLink(pathname); // Устанавливаем активный элемент в зависимости от текущего пути
  }, [pathname]);

  const handleClick = (href: string) => {
    setActiveLink(href); // Меняем активный элемент при клике
  };

  // Обработка случая, когда путь содержит taskId
  const basePath = pathname.split('/')[0] === 'task' ? '/task' : ''; // Извлекаем базовый путь "/task" без taskId

  return (
    <div className={styles.header}>
      <Link
        href={`${basePath}/instruction`}
        className={`${styles.header_item} ${activeLink.includes("/task/instruction") ? styles.active : ""}`}
        onClick={() => handleClick(`${basePath}/instruction`)}
      >
        <p>Инструкции</p>
      </Link>
      <Link
        href={`${basePath}/students_work`}
        className={`${styles.header_item} ${activeLink.includes("/task/students_work") ? styles.active : ""}`}
        onClick={() => handleClick(`${basePath}/students_work`)}
      >
        <p>Работы учащихся</p>
      </Link>
    </div>
  );
};

export default TaskHeader;