import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../components/UserWrapper";

import { PrimarySchoolCourse, SecondarySchoolCourse } from "../../../models/courseSchedule"
import { CourseCard } from "./CourseCard";
import { AddCourseCard } from "./AddCourseCard";

export const EditCoursesPanel = () => {

    const [user] = useContext(UserContext);;

    const [schedule, setSchedule] = useState<(PrimarySchoolCourse | SecondarySchoolCourse)[]>([]);

    useEffect(() => {
        if (user === undefined || user === null) return;

        if (user.primarySchoolCourses?.length > 0)
            setSchedule(user.primarySchoolCourses);

        if (user.secondarySchoolCourses?.length > 0)
            setSchedule(prev => [...prev, ...user.secondarySchoolCourses])

    }, [user])

    return (
        <>
            {schedule?.map(course =>
                <CourseCard setCourses={setSchedule} key={course.id} course={course} />
            )}
            <AddCourseCard />
        </>
    );
}