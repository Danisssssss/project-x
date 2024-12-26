// pages/api/students.ts
import { NextApiRequest, NextApiResponse } from "next";

// Пример данных (в реальном приложении данные берутся из БД)
const students = [
    { student_id: 1, name: "Иван Иванов", hasSubmitted: true, grade: 18, max_grade: 20 },
    { student_id: 2, name: "Петр Петров", hasSubmitted: false, max_grade: 20 },
    { student_id: 3, name: "Сергей Сергеев", hasSubmitted: false, max_grade: 20 },
    { student_id: 4, name: "Анна Антонова", hasSubmitted: true, grade: 20, max_grade: 20 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(students);
}