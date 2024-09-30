import React from "react";
import styles from "./course_card.module.css"

const Course_card = () => {
    return (
        <div className={styles.course_card}>
            <div className={styles.top}>
                <p className={styles.title}>Название курса</p>
            </div>
            <div className={styles.bottom}></div>
        </div>
    );
};

export default Course_card;