import React from "react";
import styles from "./course_header.module.css";
import Link from "next/link";

const Course_header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header_item}>
                <Link href="/course/feed">Лента</Link>
            </div>
            <div className={styles.header_item}>
                <Link href="/course/task">Задания</Link>
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

export default Course_header;