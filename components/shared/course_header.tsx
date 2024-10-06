"use client"; // Убедитесь, что это присутствует в начале файла

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Используем usePathname вместо useRouter

const CourseHeader = () => {
    const pathname = usePathname(); // Получаем текущий путь
    const [activeLink, setActiveLink] = useState("/course/feed");

    // Используем useEffect, чтобы установить активный элемент при загрузке страницы
    useEffect(() => {
        setActiveLink(pathname); // Устанавливаем активный элемент в зависимости от текущего пути
    }, [pathname]);

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
            <Link href="/course/users" className={`${styles.header_item} ${activeLink === "/course/users" ? styles.active : ""}`}
                onClick={() => handleClick("/course/users")}>
                <p>Пользователи</p>
            </Link>
            <Link href="/course/grades" className={`${styles.header_item} ${activeLink === "/course/grades" ? styles.active : ""}`}
                onClick={() => handleClick("/course/grades")}>
                <p>Оценки</p>
            </Link>
        </div>
    );
};

export default CourseHeader;