import React from "react";
import styles from "./students_work.module.css";
import Image from "next/image";

const Students_work = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <div className={styles.passed}>
                    <div className={styles.title}>Сдано</div>
                    <div className={styles.students}>
                        <div className={styles.student}>
                            <div className={styles.image}></div>
                            <div className={styles.name}>Фамилия Имя Отчество</div>
                            <div className={styles.grade}>
                                <input className={styles.input} type="number" placeholder="20"/>
                                из
                                <div className={styles.max_grade}>20</div>
                            </div>
                            <div className={styles.more}>
                                <Image src="/assets/images/more-black.svg" alt="" width={3} height={13}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.not_passed}>
                    <div className={styles.title}>Не сдано</div>
                    <div className={styles.students}>
                        <div className={styles.student}>
                            <div className={styles.image}></div>
                            <div className={styles.name}>Фамилия Имя Отчество</div>
                            <div className={styles.grade}>
                                <input className={styles.input} type="number" placeholder="___"/>
                                из
                                <div className={styles.max_grade}>20</div>
                            </div>
                            <div className={styles.more}>
                                <Image src="/assets/images/more-black.svg" alt="" width={3} height={13}/>
                            </div>
                        </div>
                        <div className={styles.student}>
                            <div className={styles.image}></div>
                            <div className={styles.name}>Фамилия Имя Отчество</div>
                            <div className={styles.grade}>
                                <input className={styles.input} type="number" placeholder="___"/>
                                из
                                <div className={styles.max_grade}>20</div>
                            </div>
                            <div className={styles.more}>
                                <Image src="/assets/images/more-black.svg" alt="" width={3} height={13}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.task_title}>Название задания</div>
                <div className={styles.task_grades}>
                    <div className={styles.task_passed}>
                        <div className={styles.task_count}>1</div>
                        <p className={styles.text}>Сдано</p>
                    </div>
                    <div className={styles.task_not_passed}>
                        <div className={styles.task_count}>1</div>
                        <p className={styles.text}>Не сдано</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Students_work;