import React from "react";
import styles from "./home.module.css";
import CourseCard from "../ui/course_card";

const Home = () => {
  return (
    <div className={styles.home}>
      <CourseCard title="Название курса 1" />
      <CourseCard title="Название курса 2" />
      <CourseCard title="Название курса 3" />
      <CourseCard title="Название курса 4" />
      <CourseCard title="Название курса 5" />
      <CourseCard title="Название курса 6" />
      <CourseCard title="Название курса 7" />
      <CourseCard title="Название курса 8" />
      <CourseCard title="Название курса 9" />
      <CourseCard title="Название курса 10" />
      <CourseCard title="Название курса 11" />
    </div>
  );
};

export default Home;