import Image from "next/image";
import styles from "./course_task.module.css"
import Course_task_item from "./course_task_item";

const Course_task = () => {
    return (
        <div className={styles.wrapper}>
            <a href="#" className={styles.btn_add}>
                <Image src="/assets/images/plus-white.svg" alt="+" width={16} height={16}/>
                <p>Создать</p>
            </a>
            <Course_task_item/>
            <Course_task_item/>
            <Course_task_item/>
            <Course_task_item/>
        </div>
    );
};

export default Course_task;