import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

async function up() {
    // Добавляем роли
    await prisma.role.createMany({
        data: [
            { role_name: "Учитель" },
            { role_name: "Студент" }
        ]
    });

    // Добавляем пользователей
    await prisma.user.createMany({
        data: [
            {
                name: "Student 1",
                email: "student1@test.ru",
                password: hashSync("111111", 10),
                role_id: 2
            },
            {
                name: "Student 2",
                email: "student2@test.ru",
                password: hashSync("111111", 10),
                role_id: 2
            },
            {
                name: "Teacher 1",
                email: "teacher1@test.ru",
                password: hashSync("111111", 10),
                role_id: 1
            },
            {
                name: "Teacher 2",
                email: "teacher2@test.ru",
                password: hashSync("111111", 10),
                role_id: 1
            }
        ]
    });

    // Добавляем курсы
    await prisma.course.createMany({
        data: [
            {
                title: "Программирование",
                teacher_id: 3 // Teacher 1
            },
            {
                title: "Структуры данных",
                teacher_id: 3 // Teacher 1
            },
            {
                title: "Алгоритмы",
                teacher_id: 4 // Teacher 2
            }
        ]
    });

    // Добавляем записи студентов на курсы
    await prisma.course_Enrollment.createMany({
        data: [
            { course_id: 1, student_id: 1 }, // Student 1 → Programming 101
            { course_id: 1, student_id: 2 }, // Student 2 → Programming 101
            { course_id: 2, student_id: 1 }, // Student 1 → Data Structures
            { course_id: 3, student_id: 2 }  // Student 2 → Algorithms
        ]
    });

    // Добавляем задания для каждого курса
    await prisma.assignment.createMany({
        data: [
            {
                course_id: 1,
                title: "Введение в программирование",
                description: "Изучение основ программирования.",
                max_grade: 100
            },
            {
                course_id: 1,
                title: "Переменные и типы",
                description: "Понимание переменных и типов данных.",
                max_grade: 100
            },
            {
                course_id: 2,
                title: "Стэки и очереди",
                description: "Реализация стэков и очередей.",
                max_grade: 100
            },
            {
                course_id: 2,
                title: "Бинарные деревья",
                description: "Работа с бинарными деревьями.",
                max_grade: 100
            },
            {
                course_id: 3,
                title: "Алгоритмы сортировки",
                description: "Реализация и сравнения алгоритмов сортировок.",
                max_grade: 100
            }
        ]
    });

    // Добавляем файлы для заданий
    await prisma.assignment_Files.createMany({
        data: [
            {
                file_name: "intro_programming.pdf",
                file_path: "/files/assignments/intro_programming.pdf",
                file_type: "pdf"
            },
            {
                file_name: "variables_types.pdf",
                file_path: "/files/assignments/variables_types.pdf",
                file_type: "pdf"
            },
            {
                file_name: "stacks_queues.pdf",
                file_path: "/files/assignments/stacks_queues.pdf",
                file_type: "pdf"
            }
        ]
    });

    // Привязываем файлы к заданиям
    await prisma.assignment_Files_Mappings.createMany({
        data: [
            { assignment_id: 1, file_id: 1 },
            { assignment_id: 2, file_id: 2 },
            { assignment_id: 3, file_id: 3 }
        ]
    });

    // Добавляем сдачи заданий
    await prisma.submission.createMany({
        data: [
            {
                assignment_id: 1,
                student_id: 1,
                submission_date: new Date(),
                grade: 95
            },
            {
                assignment_id: 1,
                student_id: 2,
                submission_date: new Date(),
                grade: 90
            },
            {
                assignment_id: 2,
                student_id: 1,
                submission_date: new Date(),
                grade: 85
            }
        ]
    });

    // Добавляем файлы для сдач
    await prisma.submission_Files.createMany({
        data: [
            {
                file_name: "solution_intro.zip",
                file_path: "/files/submissions/solution_intro.zip",
                file_type: "zip"
            },
            {
                file_name: "solution_variables.zip",
                file_path: "/files/submissions/solution_variables.zip",
                file_type: "zip"
            }
        ]
    });

    // Привязываем файлы к сдачам
    await prisma.submission_Files_Mappings.createMany({
        data: [
            { submission_id: 1, file_id: 1 },
            { submission_id: 2, file_id: 2 }
        ]
    });
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "Role" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Course" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Course_Enrollment" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Assignment" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Assignment_Files" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Assignment_Files_Mappings" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Submission" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Submission_Files" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Submission_Files_Mappings" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.log(e);
    }
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});