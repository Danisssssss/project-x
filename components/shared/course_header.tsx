"use client";

import React, { useState } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";

const Course_header = () => {
    const [activeLink, setActiveLink] = useState("/course/feed");
  
    const handleClick = (href: string) => {
      setActiveLink(href); // Меняем активный элемент при клике
    };
  
    return (
        <div className={styles.header}>
            <Link href="/course/feed" className={`${styles.header_item} ${activeLink === "/course/feed" ? styles.active : ""}`}
                onClick={() => handleClick("/course/feed")}>
                <p>Лента</p>
            </Link>
            <Link href="/course/task" className={`${styles.header_item} ${activeLink === "/course/task" ? styles.active : ""}`}
                onClick={() => handleClick("/course/task")}>
                <p>Задания</p>
            </Link>
            <Link href="#" className={`${styles.header_item} ${activeLink === "/course/users" ? styles.active : ""}`}
                onClick={() => handleClick("/course/users")}>
                <p>Пользователи</p>
            </Link>
            <Link href="#" className={`${styles.header_item} ${activeLink === "/course/grades" ? styles.active : ""}`}
                onClick={() => handleClick("/course/grades")}>
                <p>Оценки</p>
            </Link>
        </div>
    );
  };

export default Course_header;