"use server";
import NotAllowed from "@/components/notAllowed";
import UserForm from "@/components/userForm";
import UserList from "@/components/userList";
import { getUserCourses } from "@/controllers/user-course.controller";
import { getUsers } from "@/controllers/user.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { isTeacher } from "@/model/types";

const StudentsPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const users = await getUsers();
  const user_courses = await getUserCourses();

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3">
        <div className="flex justify-start w-full mb-4">
          <UserForm />
        </div>
        <UserList users={users} user_courses={user_courses} />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default StudentsPage;
