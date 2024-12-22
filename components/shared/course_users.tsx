"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./course_users.module.css";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/course/${courseId}/users`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        const data = await response.json();
        setTeachers(data.teachers);
        setStudents(data.students);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Не удалось загрузить данные пользователей.");
      }
    };

    fetchUsers();
  }, [courseId]);

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

      <h1 className={`${styles.title} ${styles.student_title}`}>Учащиеся</h1>
      <div className={`${styles.users} ${styles.students}`}>
        {students.map((student) => (
          <div key={student.user_id} className={styles.item}>
            <div className={styles.image}></div>
            <div className={styles.name}>{student.name}</div>
            <a href="#" className={styles.more}>
              <Image src="/assets/images/more-black.svg" width={4} height={18} alt="" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course_users;