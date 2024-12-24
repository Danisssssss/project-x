"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./course_task_item.module.css";
import Link from "next/link";

interface AssignmentProps {
  assignment: {
    assignment_id: number;
    title: string;
    description: string;
    max_grade: number;
    submissions_count: number;
    not_submitted_count: number;
    files: { file_name: string; file_path: string }[];
  };
}

const Course_task_item: React.FC<AssignmentProps> = ({ assignment }) => {
  const [isActive, setIsActive] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ""}`}
      onClick={toggleActive}
    >
      <div className={styles.item_header}>
        <div className={styles.item_header_left}>
          <Image src="/assets/images/task.svg" alt="" width={34} height={34} />
          <p className={styles.item_header_title}>{assignment.title}</p>
        </div>
        <div className={styles.item_header_right}>
          <Image src="/assets/images/more-black.svg" alt="" width={4} height={18} />
        </div>
      </div>
      <div className={styles.item_main}>
        <div className={styles.item_main_left}>
          <div className={styles.instruction}>{assignment.description}</div>
        </div>
        {userRole === "Преподаватель" && ( // Отображаем только для преподавателей
          <div className={styles.item_main_right}>
            <div className={styles.passed}>
              <div className={styles.passed_count}>{assignment.submissions_count}</div>
              <p>Сдано</p>
            </div>
            <div className={styles.not_passed}>
              <div className={styles.not_passed_count}>{assignment.not_submitted_count}</div>
              <p>Не сдано</p>
            </div>
          </div>
        )}
        <div className={styles.files}>
          {assignment.files.map((file) => (
            <a
              key={file.file_name}
              href={file.file_path}
              download
              className={styles.file_item}
            >
              <p>{file.file_name}</p>
              <Image src="/assets/images/download.svg" alt="" width={24} height={24} />
            </a>
          ))}
        </div>
      </div>
      <div className={styles.item_footer}>
        <Link href={`/task/${assignment.assignment_id}/instruction`}>Подробнее</Link>
      </div>
    </div>
  );
};

export default Course_task_item;