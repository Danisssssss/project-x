import Course_header from "../../../../components/shared/course_header";

export default function CourseLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className="main">
         <Course_header/>
         {children}
        </div>
    );
};