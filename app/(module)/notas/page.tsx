"use server";
import NotAllowed from "@/components/notAllowed";

import { getTasksByUserId } from "@/controllers/task.controller";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { isTeacher } from "@/model/types";

const CalificationPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  if (_user) {
    const tasks = await getTasksByUserId(_user?.id);
    const califications = tasks.map((t) => ({
      value: t.score,
      activity: t.id_activity,
    }));
  }

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3"></div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default CalificationPage;
