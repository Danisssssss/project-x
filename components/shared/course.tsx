import React from "react";
import styles from "./course.module.css";
import Link from "next/link";

const Course = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header_item}>
                <Link href="#">Лента</Link>
            </div>
            <div className={styles.header_item}>
                <Link href="#">Задания</Link>
            </div>
            <div className={styles.header_item}>
                <Link href="#">Пользователи</Link>
            </div>
            <div className={styles.header_item}>
                <Link href="#">Оценки</Link>
            </div>
        </div>
    );
};

export default Course;