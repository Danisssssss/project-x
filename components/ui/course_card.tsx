import React from "react";
import styles from "./course_card.module.css"
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
    title: string;
}

const Course_card: React.FC<CourseCardProps> = ({title}) => {
    return (
        <div className={styles.course_card}>
            <div className={styles.top}>
                <Link href="/course" className={styles.title}>{title}</Link>
                <a href="#" className={styles.more}>
                    <Image src="/assets/images/more.svg" alt="" width={4} height={18}/>
                </a>
            </div>
            <div className={styles.bottom}></div>
        </div>
    );
};

export default Course_card;