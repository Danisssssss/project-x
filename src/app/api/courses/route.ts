import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ message: "Token not provided" }, { status: 401 });
    }

    // Декодируем токен (например, с использованием jwt) и получаем user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Получаем роль пользователя
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: { Role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.Role.role_name === "Преподаватель") {
      // Для преподавателя возвращаем курсы, которые он создал
      const courses = await prisma.course.findMany({
        where: { teacher_id: userId },
        include: { Teacher: true },
      });
      return NextResponse.json(courses);
    } else if (user.Role.role_name === "Студент") {
      // Для студента возвращаем курсы, на которые он записан
      const courses = await prisma.course_Enrollment.findMany({
        where: { student_id: userId },
        include: {
          Course: {
            include: { Teacher: true },
          },
        },
      });
      return NextResponse.json(courses.map((enrollment) => enrollment.Course));
    } else {
      return NextResponse.json({ message: "Role not found" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ message: "Error fetching courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Token not provided" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ message: "Course title is required" }, { status: 400 });
    }

    // Создаем курс
    const newCourse = await prisma.course.create({
      data: {
        title,
        teacher_id: userId,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ message: "Error creating course" }, { status: 500 });
  }
}