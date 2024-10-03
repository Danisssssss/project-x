import React from "react";
import styles from "./course_feed.module.css";
import Image from "next/image";

const Course_feed = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>
                <div className={styles.title}>Название курса</div>
            </div>
            <div className={styles.copy_block}>
                <div className={styles.code_title}>Код курса</div>
                <div className={styles.code_element}>
                    <div className={styles.code}>xxxxxx</div>
                    <Image className={styles.btn_copy} src="/assets/images/copy.svg" alt="" width={19} height={19} />
                </div>
            </div>
        </div>
    );
};

export default Course_feed;