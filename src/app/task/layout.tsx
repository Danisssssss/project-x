import Task_header from "../../../components/shared/task_header";

export default function CourseLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className="main">
         <Task_header/>
         {children}
        </div>
    );
};