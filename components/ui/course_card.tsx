"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./course_card.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface CourseCardProps {
  courseId: number;  // Используем ID курса для передачи в маршрут
  title: string;
  teacherName?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courseId, title, teacherName }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const router = useRouter();

  const handleClick = () => {
    setBreadcrumbs(title);
    router.push(`/course/${courseId}`);  // Переход по динамическому маршруту
  };

  return (
    <div className={styles.course_card} onClick={handleClick}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        {teacherName && <div className={styles.teacher}>Преподаватель: {teacherName}</div>}
        <a href="#" className={styles.more}>
          <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
        </a>
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
};

export default CourseCard;