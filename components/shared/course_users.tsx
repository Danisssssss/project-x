"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./course_users.module.css";
import Modal from "../modal/AddUserModal";

interface User {
  user_id: number;
  name: string;
}

interface CourseUsersProps {
  courseId: string;
}

const Course_users: React.FC<CourseUsersProps> = ({ courseId }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для модального окна удаления
  const [userToDelete, setUserToDelete] = useState<number | null>(null); // Состояние для выбранного пользователя для удаления

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

    // Загружаем пользователей
    const fetchUsers = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/course/${courseId}/users`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        const data = await response.json();
        setTeachers(data.teachers);
        setStudents(data.students);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Не удалось загрузить данные пользователей.");
      }
    };

    fetchUsers();
  }, [courseId]);

  const fetchAllUsers = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/user`);
      if (!response.ok) {
        throw new Error("Ошибка при загрузке всех пользователей");
      }
      const data = await response.json();
      setAllUsers(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Не удалось загрузить список всех пользователей.");
    }
  };

  const addUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/course/${courseId}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: selectedUser }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при добавлении студента");
      }

      const newStudent = allUsers.find((user) => user.user_id === selectedUser);
      if (newStudent) {
        setStudents((prev) => [...prev, newStudent]);
      }

      alert("Студент успешно добавлен на курс!"); // Успешное сообщение
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = err.message || "Не удалось добавить студента.";
      alert(errorMessage); // Сообщение об ошибке
    }
  };

  const deleteUser = async () => {
    if (userToDelete === null) return;

    try {
      const response = await fetch(`/api/course/${courseId}/users/delete`, {
        method: "DELETE", // Замените на DELETE
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при удалении пользователя");
      }

      setStudents((prev) => prev.filter((student) => student.user_id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert("Пользователь успешно удален");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Не удалось удалить пользователя");
    }
  };


  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}

      <h1 className={`${styles.title} ${styles.teacher_title}`}>Преподаватели</h1>
      <div className={`${styles.users} ${styles.teachers}`}>
        {teachers.map((teacher) => (
          <div key={teacher.user_id} className={styles.item}>
            <div className={styles.image}></div>
            <div className={styles.name}>{teacher.name}</div>
          </div>
        ))}
      </div>

      <div className={styles.student_header}>
        <h1 className={styles.title}>Учащиеся</h1>
        {userRole === "Преподаватель" && (
          <button
            className={styles.add_user}
            onClick={() => {
              setShowModal(true);
              fetchAllUsers();
            }}
          >
            <Image src="/assets/images/add-user.svg" width={20} height={20} alt="" />
          </button>
        )}
      </div>
      <div className={`${styles.users} ${styles.students}`}>
        {students.map((student) => (
          <div key={student.user_id} className={styles.item}>
            <div className={styles.image}></div>
            <div className={styles.name}>{student.name}</div>
            {userRole === "Преподаватель" && (
              <a
                href="#"
                className={styles.more}
                onClick={(e) => {
                  e.preventDefault();
                  setUserToDelete(student.user_id);
                  setShowDeleteModal(true);
                }}
              >
                <Image src="/assets/images/delete-user.svg" width={20} height={20} alt="" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Модальное окно для добавления студента */}
      <Modal
        title="Добавить студента"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className={styles.select_wrapper}>
          <select
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            <option value="" disabled>
              Выберите студента
            </option>
            {allUsers.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select>
          <button onClick={addUser} className={styles.add_student}>Добавить</button>
        </div>
      </Modal>

      {/* Модальное окно для удаления пользователя */}
      {showDeleteModal && (
        <Modal
          title="Удалить пользователя?"
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div>
            <button onClick={() => setShowDeleteModal(false)}>Отмена</button>
            <button onClick={deleteUser}>Удалить</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Course_users;