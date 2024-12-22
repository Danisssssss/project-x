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

  useEffect(() => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.message || "Не удалось добавить студента.";
      alert(errorMessage); // Сообщение об ошибке
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
        <button
          className={styles.add_user}
          onClick={() => {
            setShowModal(true);
            fetchAllUsers();
          }}
        >
          <Image src="/assets/images/add-user.svg" width={20} height={20} alt="" />
        </button>
      </div>
      <div className={`${styles.users} ${styles.students}`}>
        {students.map((student) => (
          <div key={student.user_id} className={styles.item}>
            <div className={styles.image}></div>
            <div className={styles.name}>{student.name}</div>
          </div>
        ))}
      </div>

      <Modal
        title="Добавить студента"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div>
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
          <button onClick={addUser}>Добавить</button>
        </div>
      </Modal>
    </div>
  );
};

export default Course_users;