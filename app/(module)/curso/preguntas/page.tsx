import ActivityQuestionList from "@/components/activityQuestionList";
import { getActivitiesQuestion } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { isUserCourseInit } from "@/lib/utils";
import { Activity, isTeacher } from "@/model/types";

const QuestionPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const activitiesQuestion = await getActivitiesQuestion();
  const subjects = await getSubjects();
  let activities: Activity[] = [];

  if (isTeacher(_user?.type)) {
    activities = activitiesQuestion;
  } else {
    const user_course = await getUserCourseByUserId(_user?.id ?? null);
    const progress = user_course?.progress!;

    if (isUserCourseInit(user_course))
      for (let i = 0; i <= progress; i++) {
        const subject = subjects[i];
        const arr = activitiesQuestion.filter(
          (a) => a.id_subject === subject.id
        );
        activities.push(...arr);
      }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col items-center justify-center w-full">
        <ActivityQuestionList activities={activities} />
      </div>
    </div>
  );
};

export default QuestionPage;
