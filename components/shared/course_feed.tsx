import React from "react";
import styles from "./course_feed.module.css";

const Course_feed = ({ title }: { title: string }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>
                <div className={styles.title}>{title}</div>
            </div>
        </div>
    );
};

export default Course_feed;