import Image from "next/image";
import styles from "./course_users.module.css"

const Course_users = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={`${styles.title} ${styles.teacher_title}`}>Преподаватели</h1>
            <div className={`${styles.users} ${styles.teachers}`}>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                </div>
            </div>

            <h1 className={`${styles.title} ${styles.student_title}`}>Учащиеся</h1>
            <div className={`${styles.users} ${styles.students}`}>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                    <a href="#" className={styles.more}>
                        <Image src="/assets/images/more-black.svg" width={4} height={18} alt=""/>
                    </a>
                </div>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                    <a href="#" className={styles.more}>
                        <Image src="/assets/images/more-black.svg" width={4} height={18} alt=""/>
                    </a>
                </div>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                    <a href="#" className={styles.more}>
                        <Image src="/assets/images/more-black.svg" width={4} height={18} alt=""/>
                    </a>
                </div>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                    <a href="#" className={styles.more}>
                        <Image src="/assets/images/more-black.svg" width={4} height={18} alt=""/>
                    </a>
                </div>
                <div className={styles.item}>
                    <div className={styles.image}></div>
                    <div className={styles.name}>Фамилия Имя Отчество</div>
                    <a href="#" className={styles.more}>
                        <Image src="/assets/images/more-black.svg" width={4} height={18} alt=""/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Course_users;