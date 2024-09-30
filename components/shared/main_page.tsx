import React from "react";
import styles from "./main_page.module.css";
import Course_card from "../ui/course_card";

const Main_page = () => {
    return (
        <div className={styles.main_page}>
            <Course_card/>
        </div>
    );
};

export default Main_page;