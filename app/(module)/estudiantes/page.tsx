"use server";
import NotAllowed from "@/components/notAllowed";
import StudentList from "@/components/studentList";
import UserForm from "@/components/userForm";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getUserCourses } from "@/controllers/user-course.controller";
import { getUsers } from "@/controllers/user.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { getStudents } from "@/lib/utils";
import { STUDENT, isTeacher } from "@/model/types";

const StudentsPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const res = await getUsers();
  const users = getStudents(res);
  const user_courses = await getUserCourses();
  const subjects = await getSubjects();
  const activities = await getActivities();

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div
        className="flex flex-col flex-wrap items-center justify-center"
        style={{ width: "70%" }}
      >
        <div className="flex justify-start w-full mb-4">
          <UserForm user_type={STUDENT} />
        </div>
        <StudentList users={users} user_courses={user_courses} />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default StudentsPage;
