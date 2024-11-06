import React from "react";
import styles from "./task_instruction.module.css";
import Image from "next/image";

const Task_instruction = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <Image className={styles.task} src="/assets/images/task.svg" alt="" width={34} height={34}/>
                <h1 className={styles.title}>Название задания</h1>
                <a href="#" className={styles.more}>
                    <Image src="/assets/images/more-black.svg" alt="" width={4} height={18}/>
                </a>
            </div>
            <div className={styles.bottom}>
                <div className={styles.name}>Фамилия Имя Отчество</div>
                <div className={styles.grade}>
                    <div className={styles.count}>20</div>
                    баллов
                </div>
                <div className={styles.instruction}>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium illo iste nobis ad impedit numquam cumque nesciunt doloribus, neque commodi accusamus fuga vel, quo vero. Ut ea, perferendis obcaecati libero repellendus facilis tempora, recusandae quis non aliquid hic. Adipisci nam dolorem quas omnis? Voluptate ullam labore aut quasi tenetur sequi beatae placeat! Assumenda reprehenderit quidem aut corporis fugiat, incidunt soluta quia deserunt voluptate expedita vel voluptates dolor asperiores quibusdam facere praesentium porro repellat suscipit ab omnis! Recusandae magni consectetur veniam necessitatibus aliquam pariatur nisi incidunt vel culpa, id asperiores est eius odio assumenda possimus doloribus quibusdam praesentium! Ipsam, explicabo accusamus!
                </div>
                <div className={styles.files}>
                    <a href="/assets/images/download.svg" download className={styles.file_item}>
                        <p>название_файла.расш</p>
                        <Image src="/assets/images/download.svg" alt="" width={24} height={24} />
                    </a>
                    <a href="/assets/images/download.svg" download className={styles.file_item}>
                        <p>название_файла.расш</p>
                        <Image src="/assets/images/download.svg" alt="" width={24} height={24} />
                    </a>
                    <a href="/assets/images/download.svg" download className={styles.file_item}>
                        <p>название_файла.расш</p>
                        <Image src="/assets/images/download.svg" alt="" width={24} height={24} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Task_instruction;