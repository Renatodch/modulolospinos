"use server";
import NotAllowed from "@/components/notAllowed";
import UserForm from "@/components/userForm";
import UserList from "@/components/userList";
import { getSession, loginIsRequiredServer } from "@/lib/login-controller";
import { getUsers } from "@/lib/user-controller";

const StudentsPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const isStudent = (_user?.type || 0) === 0;

  const users = await getUsers();

  return isStudent ? (
    <NotAllowed />
  ) : (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3">
        <div className="flex justify-start w-full mb-4">
          <UserForm />
        </div>
        <UserList users={users} />
      </div>
    </div>
  );
};

export default StudentsPage;
