import Course from "../../../components/shared/course";

export default function Course_Page({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div>
         <Course/>
         {children}
        </div>
    );
};