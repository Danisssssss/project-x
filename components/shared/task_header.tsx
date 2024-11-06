"use client"; // Убедитесь, что это присутствует в начале файла

import React, { useState, useEffect } from "react";
import styles from "./course_header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Используем usePathname вместо useRouter

const TaskHeader = () => {
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
            <Link href="/task/instruction" className={`${styles.header_item} ${activeLink === "/task/instruction" ? styles.active : ""}`}
                onClick={() => handleClick("/task/instruction")}>
                <p>Инструкции</p>
            </Link>
            <Link href="/task/works" className={`${styles.header_item} ${activeLink === "/task/works" ? styles.active : ""}`}
                onClick={() => handleClick("/task/works")}>
                <p>Работы учащихся</p>
            </Link>
        </div>
    );
};

export default TaskHeader;