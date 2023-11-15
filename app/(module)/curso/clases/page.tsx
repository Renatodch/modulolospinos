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
import { getTasksActivityDetail } from "@/lib/utils";
import { Activity, TEACHER, Task, TaskActivityDetail } from "@/model/types";

export default async function ClasesPage(props: any) {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const id_user = _user?.id || 0;
  let user_course = await getUserCourseByUserId(id_user);
  if (_user?.type === TEACHER) return <NotAllowed />;

  let activities: Activity[] = [];
  let tasks: Task[] = [];
  let tasksDetail: TaskActivityDetail[] = [];
  let item = 0;

  if (!user_course)
    user_course = await saveUserCourse({
      id: 0,
      date_start: new Date(),
      date_update: new Date(),
      state: 0,
      progress: 0,
      average: null,
      id_user,
    });

  if (user_course) {
    const currentDate = new Date();
    const paramNull = props.searchParams?.item === undefined;
    item = +(props.searchParams?.item ?? 0);

    if (item > user_course.progress) {
      user_course = await saveUserCourse({
        ...user_course,
        progress: item,
        date_update: currentDate,
      });
    } else {
      paramNull && (item = user_course.progress);
    }
    activities = await getActivitiesBySubject(item);
    tasks = await getTasksByUserId(id_user);
    tasksDetail = getTasksActivityDetail(activities, tasks).filter(
      (t) => t.subject === item
    );
  }

  return (
    <div className="flex items-start justify-center w-full px-16 py-8 gap-6">
      <div className=" w-1/3 h-max" style={{ height: "500px" }}>
        <CourseContentItems interactive progress={user_course?.progress || 0} />
      </div>
      <div className=" w-2/3 ">
        <ClassItem
          item={item}
          tasksDetail={tasksDetail}
          userCourse={user_course}
        />
      </div>
    </div>
  );
}
