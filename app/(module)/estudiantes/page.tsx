"use server";
import NotAllowed from "@/components/notAllowed";
import UserForm from "@/components/userForm";
import UserList from "@/components/userList";
import { getActivities } from "@/controllers/activity.controller";
import { getTasks } from "@/controllers/task.controller";
import { getUserCourses } from "@/controllers/user-course.controller";
import { getUsers } from "@/controllers/user.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  COMPLETED,
  IN_PROGRESS,
  NOT_INIT,
  User_Progress,
  isTeacher,
} from "@/model/types";

const StudentsPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const users = await getUsers();
  const user_courses = await getUserCourses();
  const activities = await getActivities();
  const tasks = await getTasks();
  const user_progress: User_Progress[] = users.map((u) => {
    const user_course = user_courses.find((uc) => uc.id_user === u.id);

    let state = NOT_INIT,
      avgFinal = null,
      id = u.id;
    if (user_course) {
      const tasksByUser = tasks.filter(
        (t) => t.id_user === user_course.id_user
      );
      const tasksDetails = getTasksActivityDetail(activities, tasksByUser);
      state = tasksDetails.some((t) => !t.done || !t.evaluated)
        ? IN_PROGRESS
        : COMPLETED;

      avgFinal = user_course.average;
    }
    return {
      avgFinal,
      state,
      id,
    };
  });

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3">
        <div className="flex justify-start w-full mb-4">
          <UserForm />
        </div>
        <UserList
          users={users}
          user_progress={user_progress}
          tasks={tasks}
          activities={activities}
        />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default StudentsPage;
