"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./course_card.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface CourseCardProps {
  title: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const router = useRouter();

  const handleClick = () => {
    setBreadcrumbs(title);
    router.push("/course/feed");
  };

  return (
    <div className={styles.course_card} onClick={handleClick}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <a href="#" className={styles.more}>
          <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
        </a>
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
};

export default CourseCard;