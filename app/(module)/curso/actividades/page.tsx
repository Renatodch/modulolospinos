"use server";
import NotAllowed from "@/components/notAllowed";

import ActivityForm from "@/components/activityForm";
import ActivityList from "@/components/activityList";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { isTeacher } from "@/model/types";

const ActivitiesPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  const subjects = await getSubjects();
  const activities = await getActivities();

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div
        className="flex flex-col flex-wrap items-center justify-center"
        style={{ width: "70%" }}
      >
        <div className="flex justify-start w-full mb-4">
          <ActivityForm />
        </div>
        <ActivityList activities={activities} subjects={subjects} />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default ActivitiesPage;
