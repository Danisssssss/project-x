import React from "react";
import styles from "./task_instruction.module.css";
import Image from "next/image";

// Типы данных для задания
interface File {
  file_name: string;
  file_path: string;
}

interface TaskInstructionProps {
  title: string;
  description: string;
  max_grade: number;
  files: File[];
  teacherName: string; // Новое свойство для имени преподавателя
}

const Task_instruction: React.FC<TaskInstructionProps> = ({ title, description, max_grade, files, teacherName }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.task_wrapper}>
        <div className={styles.top}>
          <Image className={styles.task} src="/assets/images/task.svg" alt="" width={34} height={34} />
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.bottom}>
          <div className={styles.teacher}>Преподаватель: {teacherName}</div>
          <div className={styles.grade}>
            <div className={styles.count}>{max_grade}</div>
            баллов
          </div>
          <div className={styles.instruction}>{description}</div>
          <div className={styles.files}>
            {files.map((file, index) => (
              <a href={file.file_path} download key={index} className={styles.file_item}>
                <p>{file.file_name}</p>
                <Image src="/assets/images/download.svg" alt="" width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.pass}>
        <div className={styles.pass_title}>Мои задания</div>
        <a href="#" className={styles.add_btn}>
          <Image src="/assets/images/plus.svg" alt="+" width={14} height={14} />
          Добавить файлы
          <input type="file" style={{ display: "none" }} />
        </a>
        <button className={styles.pass_btn}>
          Сдать
        </button>
      </div>
    </div>
  );
};

export default Task_instruction;