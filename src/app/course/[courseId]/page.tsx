"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "../../../../components/shared/course_feed.module.css";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<{ title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(course?.title || "");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
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
      }
    };

    const fetchCourse = async () => {
      if (courseId) {
        try {
          const response = await fetch(`/api/courses/${courseId}`);
          if (response.ok) {
            const courseData = await response.json();
            setCourse(courseData);
            setNewTitle(courseData.title);
          } else {
            console.error("Ошибка загрузки данных курса");
          }
        } catch (error) {
          console.error("Ошибка при запросе:", error);
        }
      }
    };

    fetchUserRole();
    fetchCourse();
  }, [courseId]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewTitle(course?.title || "");
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
          setCourse(updatedCourse);
          setIsModalOpen(false);
        } else {
          console.error("Ошибка при обновлении курса");
        }
      } catch (error) {
        console.error("Ошибка при запросе:", error);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  if (!course) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <div className={styles.title}>{course.title}</div>
        {userRole === "Преподаватель" && (
          <div className={styles.more} onClick={handleMoreClick}>
            <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
          </div>
        )}
      </div>

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
              <button className={styles.cancel} onClick={handleCancel}>
                Отмена
              </button>
              <button className={styles.change} onClick={handleSave}>
                Изменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;