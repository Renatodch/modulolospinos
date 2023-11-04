"use server";
import UserForm from "@/components/userForm";
import UserList from "@/components/userList";
import { User } from "@/entities/entities";
import { loginIsRequiredServer } from "@/lib/login-controller";
import { getUsers } from "@/lib/user-controller";
import React from "react";

const Estudiantes = async () => {
  await loginIsRequiredServer();
  const users = await getUsers();

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3">
        <div className="flex justify-start w-full">
          <UserForm />
        </div>
        <UserList users={users} />
      </div>
    </div>
  );
};

export default Estudiantes;
