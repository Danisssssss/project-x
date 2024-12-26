"use client";

import React, { useEffect, useState } from "react";
import styles from "./students_work.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Типы данных
type Student = {
  user_id: number;
  name: string;
};

type AssignmentData = {
  assignmentTitle: string;
  maxGrade: number;
  submitted: Student[];
  notSubmitted: Student[];
};

const Students_work = () => {
  const router = useRouter();
  const [data, setData] = useState<AssignmentData>({
    assignmentTitle: "",
    maxGrade: 0,
    submitted: [],
    notSubmitted: [],
  });

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (id) {
      fetch(`/api/task/${id}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.passed}>
          <div className={styles.title}>Сдано</div>
          <div className={styles.students}>
            {data.submitted.map((student) => (
              <div key={student.user_id} className={styles.student}>
                <div className={styles.image}></div>
                <div className={styles.name}>{student.name}</div>
                <div className={styles.grade}>
                  <input className={styles.input} type="number" placeholder="20" />
                  из
                  <div className={styles.max_grade}>{data.maxGrade}</div>
                </div>
                <div className={styles.more}>
                  <Image src="/assets/images/more-black.svg" alt="" width={3} height={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.not_passed}>
          <div className={styles.title}>Не сдано</div>
          <div className={styles.students}>
            {data.notSubmitted.map((student) => (
              <div key={student.user_id} className={styles.student}>
                <div className={styles.image}></div>
                <div className={styles.name}>{student.name}</div>
                <div className={styles.grade}>
                  <input className={styles.input} type="number" placeholder="___" />
                  из
                  <div className={styles.max_grade}>{data.maxGrade}</div>
                </div>
                <div className={styles.more}>
                  <Image src="/assets/images/more-black.svg" alt="" width={3} height={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.task_title}>{data.assignmentTitle}</div>
        <div className={styles.task_grades}>
          <div className={styles.task_passed}>
            <div className={styles.task_count}>{data.submitted.length}</div>
            <p className={styles.text}>Сдано</p>
          </div>
          <div className={styles.task_not_passed}>
            <div className={styles.task_count}>{data.notSubmitted.length}</div>
            <p className={styles.text}>Не сдано</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students_work;