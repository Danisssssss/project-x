"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./course_task_item.module.css";
import Link from "next/link";

interface File {
  file_name: string;
  file_path: string;
}

interface AssignmentProps {
  assignment: {
    assignment_id: number;
    title: string;
    description: string;
    max_grade: number;
    submissions_count: number;
    not_submitted_count: number;
    files: File[];
  };
}

const Course_task_item: React.FC<AssignmentProps> = ({ assignment }) => {
  const [isActive, setIsActive] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [updatedAssignment, setUpdatedAssignment] = useState(assignment);
  // const [newFiles, setNewFiles] = useState<File[]>([]);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setUpdatedAssignment((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const filesArray = Array.from(e.target.files).map((file) => ({
  //       file_name: file.name,
  //       file_path: URL.createObjectURL(file),  // Генерация временного URL для файла
  //     }));
  //     setNewFiles((prev) => [...prev, ...filesArray]);
  //   }
  // };

  // const handleDeleteFile = (fileIndex: number, isNewFile: boolean) => {
  //   if (isNewFile) {
  //     setNewFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  //   } else {
  //     setUpdatedAssignment((prev) => ({
  //       ...prev,
  //       files: prev.files.filter((_, index) => index !== fileIndex),
  //     }));
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   formData.append("title", updatedAssignment.title);
  //   formData.append("description", updatedAssignment.description);
  //   formData.append("max_grade", updatedAssignment.max_grade.toString());

  //   // Добавляем файлы в FormData
  //   newFiles.forEach((file) => {
  //     formData.append("new_files", file.file_path); // Передаем файл, а не его путь
  //   });

  //   try {
  //     const response = await fetch(`/api/course/${assignment.assignment_id}/update`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUpdatedAssignment(data.assignment);
  //       setNewFiles([]);
  //       toggleModal();
  //     } else {
  //       console.error("Ошибка при обновлении задания");
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при отправке данных:", error);
  //   }
  // };

  useEffect(() => {
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
    <div onClick={toggleActive} className={`${styles.item} ${isActive ? styles.active : ""}`}>
      <div className={styles.item_header}>
        <div className={styles.item_header_left}>
          <Image src="/assets/images/task.svg" alt="" width={34} height={34} />
          <p className={styles.item_header_title}>
            {assignment.title}
          </p>
        </div>
        {/* <div className={styles.item_header_right} onClick={toggleModal}>
          <Image src="/assets/images/more-black.svg" alt="" width={4} height={18} />
        </div> */}
      </div>

      {/* {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2 className={styles.title}>Изменить задание</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className={styles.title_item} htmlFor="title">Название</label>
                <input
                  className={styles.modal_field}
                  type="text"
                  id="title"
                  name="title"
                  value={updatedAssignment.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={styles.title_item} htmlFor="description">Описание</label>
                <textarea
                  className={styles.modal_field}
                  id="description"
                  name="description"
                  value={updatedAssignment.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={styles.title_item} htmlFor="max_grade">Максимальный балл</label>
                <input
                  className={styles.modal_field}
                  type="number"
                  id="max_grade"
                  name="max_grade"
                  value={updatedAssignment.max_grade}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={styles.title_item}>Текущие файлы</label>
                {updatedAssignment.files.map((file, index) => (
                  <div className={styles.files_area} key={index}>
                    <p>{file.file_name}</p>
                    <button type="button" onClick={() => handleDeleteFile(index, false)}>Удалить</button>
                  </div>
                ))}
              </div>
              <div>
                <label className={styles.title_item}>Новые файлы</label>
                {newFiles.map((file, index) => (
                  <div className={styles.files_area} key={index}>
                    <p>{file.file_name}</p>
                    <button type="button" onClick={() => handleDeleteFile(index, true)}>Удалить</button>
                  </div>
                ))}
                <input
                  className={styles.modal_field}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <div className={styles.buttons}>
                <button className={styles.cancel_btn} type="button" onClick={toggleModal}>Закрыть</button>
                <button className={styles.save_btn} type="submit">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      <div className={styles.item_main}>
        <div className={styles.item_main_left}>
          <div className={styles.instruction}>{assignment.description}</div>
        </div>
        {userRole === "Преподаватель" && (
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
        <Link href={`/task/${assignment.assignment_id}`}>Подробнее</Link>
      </div>
    </div>
  );
};

export default Course_task_item;