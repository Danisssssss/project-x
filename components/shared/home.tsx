import React from "react";
import styles from "./home.module.css";
import Course_card from "../ui/course_card";

const Home = () => {
    return (
        <div className={styles.home}>
            <Course_card title="Название курса 1"/>
            <Course_card title="Название курса 2"/>
            <Course_card title="Название курса 3"/>
            <Course_card title="Название курса 4"/>
            <Course_card title="Название курса 5"/>
            <Course_card title="Название курса 6"/>
            <Course_card title="Название курса 7"/>
            <Course_card title="Название курса 8"/>
            <Course_card title="Название курса 9"/>
            <Course_card title="Название курса 10"/>
            <Course_card title="Название курса 11"/>
        </div>
    );
};

export default Home;