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
      <div className={styles.top}>
        <Image className={styles.task} src="/assets/images/task.svg" alt="" width={34} height={34} />
        <h1 className={styles.title}>{title}</h1>
        <a href="#" className={styles.more}>
          <Image src="/assets/images/more-black.svg" alt="" width={4} height={18} />
        </a>
      </div>
      <div className={styles.bottom}>
        <div className={styles.teacher}>Преподаватель: {teacherName}</div> {/* Добавлено поле преподавателя */}
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
  );
};

export default Task_instruction;