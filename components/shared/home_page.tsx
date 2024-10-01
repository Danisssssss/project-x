import React from "react";
import styles from "./home_page.module.css";
import Course_card from "../ui/course_card";

const Home_page = () => {
    return (
        <div className={styles.home_page}>
            <Course_card title="Название курса"/>
            <Course_card title="Название курса"/>
            <Course_card title="Название курса"/>
            <Course_card title="Название курса"/>
            <Course_card title="Название курса"/>
        </div>
    );
};

export default Home_page;