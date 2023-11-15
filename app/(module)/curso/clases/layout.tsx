"use server";
import { UserContextProvider } from "@/app/context";
import { getTaskByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import { getSession } from "@/lib/auth-config";

export default async function Layout({ children }: { children: any }) {
  const { _user } = await getSession();
  const _user_course = await getUserCourseByUserId(_user?.id || 0);
  const _task = await getTaskByUserId(_user?.id || 0);

  return (
    <UserContextProvider
      _user={_user}
      _user_course={_user_course}
      _task={_task}
    >
      {children}
    </UserContextProvider>
  );
}
