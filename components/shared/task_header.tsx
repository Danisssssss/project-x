"use client";

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const TaskHeader = () => {
  const pathname = usePathname(); // Текущий путь
  const { taskId } = useParams(); // Получаем taskId из параметров маршрута
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(pathname); // Устанавливаем активный элемент
  }, [pathname]);

  const generateLink = (path: string) => `/task/${taskId}${path}`;

  return (
    <div className={styles.header}>
      {/* Проверяем, что путь соответствует `/task/[taskId]` */}
      <Link
        href={`/task/${taskId}`}
        className={`${styles.header_item} ${activeLink === `/task/${taskId}` ? styles.active : ""}`}
      >
        <p>Инструкции</p>
      </Link>
      <Link
        href={generateLink("/students_work")}
        className={`${styles.header_item} ${activeLink.includes("/students_work") ? styles.active : ""}`}
      >
        <p>Работы учащихся</p>
      </Link>
    </div>
  );
};

export default TaskHeader;