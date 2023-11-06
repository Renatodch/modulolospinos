"use server";

import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import NotAllowed from "@/components/notAllowed";
import { getSession, loginIsRequiredServer } from "@/lib/login-controller";
import { getUserCourseByUserId, saveUserCourse } from "@/lib/user-controller";
import { User_Course } from "@/types/types";

export default async function ClasesPage(props: any) {
  await loginIsRequiredServer();
  const { _user_course, _user } = await getSession();
  const item = +(props.searchParams.item ?? (_user_course?.progress || 0));
  const isStudent = (_user?.type || 0) === 0;

  const id_user = _user?.id || 0;
  let user_course: User_Course | null | undefined = await getUserCourseByUserId(
    id_user
  );

  if (isStudent) {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 5);

    user_course = await saveUserCourse(
      user_course
        ? {
            ...user_course,
            date_last_entry: currentDate,
            progress: item < user_course.progress ? user_course.progress : item,
          }
        : {
            date_start: currentDate,
            date_last_entry: currentDate,
            date_end: null,
            id_user,
            progress: 0,
            id: 0,
            date_project_assigned: null,
            tryouts: 0,
            state: 0,
          }
    );
  }
  const progress = user_course?.progress || 0;

  return isStudent ? (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      <div className=" w-1/3 h-max" style={{ height: "500px" }}>
        <CourseContentItems interactive progress={progress} />
      </div>
      <div className=" w-2/3 ">
        <ClassItem item={item} />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
}
