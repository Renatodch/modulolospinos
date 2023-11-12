"use server";

import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import NotAllowed from "@/components/notAllowed";
import { getSession, loginIsRequiredServer } from "@/lib/login-controller";
import { getUserCourseByUserId, saveUserCourse } from "@/lib/user-controller";
import { COURSE_LAST_ITEM_INDEX, User_Course, isStudent } from "@/types/types";

export default async function ClasesPage(props: any) {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const id_user = _user?.id || 0;
  let user_course: User_Course | null | undefined = await getUserCourseByUserId(
    id_user
  );

  const item = +(props.searchParams?.item ?? (user_course?.progress || 0));
  const allowed = isStudent(_user?.type || 0);

  if (allowed) {
    const currentDate = new Date();

    if (user_course) {
      let dateAssigned = new Date();
      let maxDateToSend = new Date();
      maxDateToSend.setDate(dateAssigned.getDate() + 1);

      const setDateAssigned: boolean =
        item === COURSE_LAST_ITEM_INDEX && !user_course.date_project_assigned;
      const setMaxDateToSend: boolean =
        item === COURSE_LAST_ITEM_INDEX && !user_course.date_project_send_max;

      let date_project_send_max = setMaxDateToSend
        ? maxDateToSend
        : user_course.date_project_send_max;
      let date_project_assigned = setDateAssigned
        ? dateAssigned
        : user_course.date_project_assigned;

      user_course = await saveUserCourse({
        ...user_course,
        date_last_entry: currentDate,
        date_project_assigned,
        date_project_send_max,
        progress: item < user_course.progress ? user_course.progress : item,
      });
    } else {
      user_course = await saveUserCourse({
        date_start: currentDate,
        date_last_entry: currentDate,
        date_end: null,
        id_user,
        progress: 0,
        id: 0,
        date_project_assigned: null,
        date_project_send_max: null,
        state: 0,
      });
    }
  }

  return allowed ? (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      <div className=" w-1/3 h-max" style={{ height: "500px" }}>
        <CourseContentItems interactive progress={user_course?.progress || 0} />
      </div>
      <div className=" w-2/3 ">
        <ClassItem
          item={item}
          maxDateToSend={user_course?.date_project_send_max}
        />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
}
