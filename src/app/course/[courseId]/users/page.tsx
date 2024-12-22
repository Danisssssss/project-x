import Course_users from "../../../../../components/shared/course_users";

export default function Course_task_page({ params }: { params: { courseId: string } }) {
  return <Course_users courseId={params.courseId} />;
}