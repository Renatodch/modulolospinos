"use server";

import ClassItem from "@/components/classItem";
import CourseContentItems from "@/components/courseContentItems";
import NotAllowed from "@/components/notAllowed";
import { getActivitiesBySubject } from "@/controllers/activity.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import {
  getUserCourseByUserId,
  saveUserCourse,
} from "@/controllers/user-course.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import {
  Activity,
  Task,
  TaskDone,
  User_Course,
  isStudent,
} from "@/model/types";

export default async function ClasesPage(props: any) {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const id_user = _user?.id || 0;
  let user_course: User_Course | null | undefined = await getUserCourseByUserId(
    id_user
  );
  let activities: Activity[] | null | undefined = [];
  let tasks: Task[] | null | undefined;
  let tasksDone: TaskDone[] = [];

  const allowed = isStudent(_user?.type || 0);
  let maxDateToSend,
    dateAssigned,
    item = 0,
    projectsDone;

  if (allowed) {
    if (user_course) {
      const currentDate = new Date();
      const item = +props.searchParams?.item ?? 0;
      activities = await getActivitiesBySubject(item);
      tasks = await getTasksByUserId(id_user);
      tasksDone = activities.map((a) => {
        return {
          done: !!tasks?.find((t) => t.id_activity === a.id),
          id_activity: a.id,
        };
      });
      //item > user_course.progress && (user_course.progress = item);

      maxDateToSend = new Date();
      maxDateToSend.setDate(currentDate.getDate() + 1);

      if (
        !user_course.date_project_send_max ||
        !user_course.date_project_assigned ||
        item > user_course.progress
      ) {
        user_course = await saveUserCourse({
          ...user_course,
          progress: item,
          date_update: currentDate,
          date_project_assigned: currentDate,
          date_project_send_max: maxDateToSend,
        });
      } else {
        dateAssigned = user_course.date_project_assigned;
        maxDateToSend = user_course.date_project_send_max;
      }
      /* 
      const setDateAssigned: boolean =
        item === COURSE_LAST_ITEM_INDEX && !user_course.date_project_assigned;
      const setMaxDateToSend: boolean =
        item === COURSE_LAST_ITEM_INDEX && !user_course.date_project_send_max;

      let date_project_send_max = setMaxDateToSend
        ? maxDateToSend
        : user_course.date_project_send_max;
      let date_project_assigned = setDateAssigned
        ? dateAssigned
        : user_course.date_project_assigned; */
    } else {
      user_course = await saveUserCourse({
        date_start: new Date(),
        date_update: new Date(),
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
          activities={activities?.filter((a) => a.subject === item)}
          maxDateToSend={maxDateToSend}
          dateAssigned={dateAssigned}
          tasksDone={tasksDone}
        />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
}
