import Image from "next/image";
import styles from "./course_task.module.css"

const Course_task = () => {
    return (
        <div className={styles.wrapper}>
            <a href="#" className={styles.btn_add}>
                <Image src="/assets/images/plus-white.svg" alt="+" width={16} height={16}/>
                <p>Создать</p>
            </a>
            <div className={styles.item}>
                <div className={`${styles.item_header} ${styles.active}`}>
                    <div className={styles.item_header_left}>
                        <Image src="/assets/images/task.svg" alt="" width={34} height={34}/>
                        <p className={styles.item_header_title}>Название задания</p>
                    </div>
                    <div className={styles.item_header_right}>
                        <Image src="/assets/images/more-black.svg" alt="" width={4} height={18}/>
                    </div>
                </div>
                <div className={styles.item_main}>
                    <div className={styles.item_main_left}>
                        <div className={styles.instruction}>Инструкция задания</div>
                    </div>
                    <div className={styles.item_main_right}>
                        <div className={styles.passed}>
                            <div className={styles.passed_count}>1</div>
                            <p>Сдано</p>
                        </div>
                        <div className={styles.not_passed}>
                            <div className={styles.not_passed_count}>1</div>
                            <p>Не сдано</p>
                        </div>
                    </div>
                    <div className={styles.files}>
                        <a href="/assets/images/download.svg" download className={styles.file_item}>
                            <p>название_файла.расш</p>
                            <Image src="/assets/images/download.svg" alt="" width={24} height={24}/>
                        </a>
                    </div>
                </div>
                <div className={styles.item_footer}>
                    <a href="#">Подробнее</a>
                </div>
            </div>
        </div>
    );
};

export default Course_task;