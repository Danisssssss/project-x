import { prisma } from "../../../../../prisma/prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { assignment_id: parseInt(id, 10) },
      include: {
        Course: {
          include: {
            Enrollments: {
              include: { Student: true },
            },
          },
        },
        Submissions: {
          include: { Student: true },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const courseStudents = assignment.Course.Enrollments.map((e) => e.Student);
    const submittedStudents = assignment.Submissions.map((s) => s.Student);

    const notSubmittedStudents = courseStudents.filter(
      (student) => !submittedStudents.some((s) => s.user_id === student.user_id)
    );

    res.status(200).json({
      assignmentTitle: assignment.title,
      maxGrade: assignment.max_grade,
      submitted: submittedStudents,
      notSubmitted: notSubmittedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
