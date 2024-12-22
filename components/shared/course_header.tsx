"use client";

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const CourseHeader = () => {
    const pathname = usePathname(); // Текущий путь
    const { courseId } = useParams(); // Получаем courseId из URL
    const [activeLink, setActiveLink] = useState("");

    useEffect(() => {
        setActiveLink(pathname); // Устанавливаем активный элемент
    }, [pathname]);

    const generateLink = (path: string) => `/course/${courseId}${path === "/" ? "" : path}`;

    return (
        <div className={styles.header}>
            <Link
                href={generateLink("/")}
                className={`${styles.header_item} ${activeLink === `/course/${courseId}` ? styles.active : ""}`}
            >
                <p>Лента</p>
            </Link>
            <Link
                href={generateLink("/tasks")}
                className={`${styles.header_item} ${activeLink.endsWith("/tasks") ? styles.active : ""}`}
            >
                <p>Задания</p>
            </Link>
            <Link
                href={generateLink("/users")}
                className={`${styles.header_item} ${activeLink.endsWith("/users") ? styles.active : ""}`}
            >
                <p>Пользователи</p>
            </Link>
        </div>
    );
};

export default CourseHeader;