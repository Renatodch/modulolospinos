"use server";
import { UserContextProvider } from "@/app/context";
import { getSession } from "@/lib/login-controller";
import { getProjectByUserId } from "@/lib/project-controller";
import { getUserCourseByUserId } from "@/lib/user-controller";

export default async function Layout({ children }: { children: any }) {
  const { _user } = await getSession();
  const _user_course = await getUserCourseByUserId(_user?.id || 0);
  const _project = await getProjectByUserId(_user?.id || 0);

  return (
    <UserContextProvider
      _user={_user}
      _user_course={_user_course}
      _project={_project}
    >
      {children}
    </UserContextProvider>
  );
}
